import {
  ScreenSearchDesktopOutlined,
  StopScreenShareOutlined,
  VideocamOffOutlined,
  RadioButtonChecked,
  VideocamOutlined,
  ChevronRight,
  ChevronLeft,
  CallEnd,
  MicOff,
  Send,
  Mic,
} from "@mui/icons-material";
import sendNotification from "../../utils/sendNotifications";
import React, { useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import MessageBox from "../../Components/MessageBox";
import { useParams } from "react-router-dom";
import { appServer } from "../../utils";
import socket from "../../utils/socket";
import axios from "axios";
import "@tensorflow/tfjs";

function VirtualBackground() {
  const userImage =
    JSON.parse(localStorage.getItem("user"))?.image.url || "/Profile.png";
  const userName = JSON.parse(localStorage.getItem("user")).name;
  const [IsCallRecording, setIsCallRecording] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [PeerConnection, setPeerConnection] = useState(null);
  const [RecorderCanvas, setRecorderCanvas] = useState(null);
  const [RemoteStream, setRemoteStream] = useState(null);
  const [LocalStream, setLocalStream] = useState(null);

  const virtualBackgroundImage = "/background.jpeg";
  const RemoteVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const ws = socket;

  ws.connect();

  useEffect(() => {
    const initVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        const video = videoRef.current;
        video.srcObject = stream;

        const net = await bodyPix.load();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const virtualImage = new Image();
        virtualImage.src = virtualBackgroundImage;

        const processFrame = async () => {
          try {
            const segmentation = await net.segmentPerson(video);

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(virtualImage, 0, 0, canvas.width, canvas.height);

            const { width, height, data } = segmentation;
            ctx.beginPath();
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const index = y * width + x;
                if (data[index] === 1) {
                  ctx.rect(
                    (x / width) * canvas.width,
                    (y / height) * canvas.height,
                    canvas.width / width,
                    canvas.height / height
                  );
                }
              }
            }
            ctx.closePath();

            ctx.globalCompositeOperation = "source-in";
            ctx.clip();
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = "source-over";

            requestAnimationFrame(processFrame);
          } catch (err) {
            console.log(err);
          }
        };

        const localStream = new MediaStream();

        const videoTrack = canvas.captureStream().getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];

        localStream.addTrack(videoTrack);
        localStream.addTrack(audioTrack);

        setLocalStream(localStream);

        processFrame();
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    if (videoRef.current || canvasRef.current) {
      initVideoStream();
    }
  }, [videoRef.current, canvasRef.current]);

  useEffect(() => {
    if (!LocalStream) return;

    const pc =
      PeerConnection ||
      new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          },
        ],
      });
    !PeerConnection && setPeerConnection(pc);

    pc.addEventListener("track", (ev) => {
      setRemoteStream(ev.streams[0]);
    });

    pc.addEventListener("icecandidate", (ev) => {
      try {
        if (ev.candidate) {
          ws.emit("ice-candidate", ev.candidate);
        }
      } catch (err) {
        console.log(err);
      }
    });

    const senders = pc.getSenders();
    if (senders.length > 0) {
      LocalStream.getTracks().map((track) =>
        senders
          .filter((sender) => sender.track.kind === track.kind)[0]
          .replaceTrack(track)
      );
    } else {
      LocalStream.getTracks().map((track) => pc.addTrack(track, LocalStream));
    }

    const InitializePeer = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ws.emit("offer", offer);
      } catch (err) {
        console.log(err);
      }
    };

    if (!PeerConnection) {
      InitializePeer();
    }

    const HandleCandidate = async (candidate) => {
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.log(err);
      }
    };

    const HandleOffer = async (offer) => {
      try {
        await pc.setRemoteDescription(offer);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.emit("answer", answer);
      } catch (err) {
        console.log(err);
      }
    };

    const HandleAnswer = async (answer) => {
      try {
        await pc.setRemoteDescription(answer);
      } catch (err) {
        console.log(err);
      }
    };

    ws.on("ice-candidate", HandleCandidate);
    ws.on("answer", HandleAnswer);
    ws.on("offer", HandleOffer);
    return () => {
      ws.off("ice-candidate", HandleCandidate);
      ws.off("answer", HandleAnswer);
      ws.off("offer", HandleOffer);
    };
  }, [LocalStream, PeerConnection, ws]);

  useEffect(() => {
    if (RemoteStream) {
      RemoteVideoRef.current.srcObject = RemoteStream;
    }
  }, [RemoteStream]);

  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center position-relative"
      style={{ height: "100vh" }}
    >
      <video ref={videoRef} className="d-none" autoPlay playsInline />
      <canvas
        className="position-absolute rounded"
        ref={canvasRef}
        style={{
          transform: "rotateY(180deg)",
          height: "auto",
          width: "35%",
          bottom: "5%",
          right: "5%",
        }}
      />
      <video
        className="h-100 w-auto"
        ref={RemoteVideoRef}
        playsInline
        autoPlay
      />
    </div>
  );
}

export default VirtualBackground;
