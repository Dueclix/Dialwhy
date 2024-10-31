import {
  ScreenSearchDesktopOutlined,
  StopScreenShareOutlined,
  VideocamOffOutlined,
  VideocamOutlined,
  PlayArrowRounded,
  MicOff,
  Pause,
  Stop,
  Mic,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { appServer } from "../../utils";
import socket from "../../utils/socket";
import axios from "axios";

const RTCPeerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const RecordTut = () => {
  const [ScreenShareToggle, setScreenShareToggle] = useState(false);
  const [RecorderState, setRecorderState] = useState("inactive");
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [RecorderStream, setRecorderStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [ScreenStream, setScreenStream] = useState(null);
  const [LocalStream, setLocalStream] = useState(null);
  const [MicToggle, setMicToggle] = useState(true);
  const [CamToggle, setCamToggle] = useState(true);
  const [PeerA, setPeerA] = useState(null);
  const [PeerB, setPeerB] = useState(null);
  const RecorderVideoRef = useRef(null);
  const RecorderChunksRef = useRef([]);
  const screenVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const CanvasRef = useRef(null);
  const ws = socket;

  ws.connect();

  const ShareScreen = async () => {
    try {
      const newState = !ScreenShareToggle;

      if (newState) {
        const userMediaStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        setScreenStream(userMediaStream);

        userMediaStream.getTracks().map((track) =>
          track.addEventListener("ended", () => {
            setScreenShareToggle(false);
            setScreenStream(null);
          })
        );
      } else {
        const userMediaStream = ScreenStream;
        userMediaStream.getTracks().map((track) => track.stop());
        setScreenStream(null);
      }

      setScreenShareToggle(newState);
    } catch (err) {
      console.log(err);
    }
  };

  const ToggleRecording = () => {
    if (mediaRecorder.state === "inactive") {
      mediaRecorder.start();
    } else {
      mediaRecorder.stop();
    }
    setRecorderState(mediaRecorder.state);
  };

  const PauseToggler = () => {
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    } else {
      mediaRecorder.state === "paused"
        ? mediaRecorder.resume()
        : mediaRecorder.start();
    }
    setRecorderState(mediaRecorder.state);
  };

  useEffect(() => {
    const stream = new MediaStream();

    const pcA = new RTCPeerConnection(RTCPeerConfig);
    setPeerA(pcA);

    const pcB = new RTCPeerConnection(RTCPeerConfig);
    setPeerB(pcB);

    pcB.ontrack = (ev) => {
      stream.addTrack(ev.track);
      setRecorderStream(stream);
    };

    pcA.onicecandidate = (ev) => {
      if (ev.candidate) {
        pcB.addIceCandidate(ev.candidate).catch(console.error);
      }
    };

    const connectPeers = async () => {
      const offer = await pcA.createOffer();
      await pcA.setLocalDescription(offer);
      await pcB.setRemoteDescription(offer);

      const answer = await pcB.createAnswer();
      await pcB.setLocalDescription(answer);
      await pcA.setRemoteDescription(answer);
    };

    connectPeers();

    return () => {
      pcA.close();
      pcB.close();
    };
  }, []);

  useEffect(() => {
    const startLocalStream = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInput = devices.find((device) => device.kind === "videoinput");
      const audioInput = devices.find((device) => device.kind === "audioinput");

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: videoInput?.deviceId,
          width: { min: 640, ideal: 1920, max: 1920 },
          height: { min: 400, ideal: 1080 },
        },
        audio: {
          deviceId: audioInput?.deviceId,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setLocalStream(localStream);

      if (
        PeerA &&
        PeerA.signalingState === "stable" &&
        PeerB &&
        PeerB.signalingState === "stable"
      ) {
        localStream.getTracks().forEach((track) => {
          PeerA.addTrack(track, localStream);
          PeerB.addTrack(track, localStream);
        });
      }

      return () => {
        localStream.getTracks().forEach((track) => track.stop());
      };
    };

    if (!LocalStream) {
      startLocalStream();
    }

    return () => {
      if (LocalStream) {
        LocalStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [PeerA, PeerB, LocalStream]);

  useEffect(() => {
    if (!(PeerA && PeerA?._shimmedLocalStreams)) return;

    try {
      const peerStream = PeerA._shimmedLocalStreams;
      const keys = Object.keys(peerStream);

      const mediaStream = peerStream[keys[0]][0];

      console.log(mediaStream.getTracks());
    } catch (err) {
      console.log(err);
    }
  }, [PeerA, PeerA?._shimmedLocalStreams]);

  useEffect(() => {
    localVideoRef.current.srcObject = LocalStream;
  }, [LocalStream]);

  useEffect(() => {
    if (ScreenStream) {
      screenVideoRef.current.srcObject = ScreenStream;
    } else {
      screenVideoRef.current.srcObject = null;
    }
  }, [ScreenStream]);

  useEffect(() => {
    if (RecorderStream) {
      RecorderVideoRef.current.srcObject = RecorderStream;
    } else {
      RecorderVideoRef.current.srcObject = null;
    }
  }, [RecorderStream]);

  useEffect(() => {
    if (LocalStream) {
      const videoTrackEnabled = LocalStream.getVideoTracks()[0].enabled;
      const audioTrackEnabled = LocalStream.getAudioTracks()[0].enabled;
      const localStream = LocalStream;

      if (!CamToggle && videoTrackEnabled) {
        localStream.getVideoTracks()[0].enabled = CamToggle;
        setLocalStream(localStream);
      } else if (CamToggle && !videoTrackEnabled) {
        localStream.getVideoTracks()[0].enabled = CamToggle;
        setLocalStream(localStream);
      }

      if (!MicToggle && audioTrackEnabled) {
        localStream.getAudioTracks()[0].enabled = MicToggle;
        setLocalStream(localStream);
      } else if (MicToggle && !audioTrackEnabled) {
        localStream.getAudioTracks()[0].enabled = MicToggle;
        setLocalStream(localStream);
      }
    }
  }, [LocalStream, CamToggle, MicToggle]);

  useEffect(() => {
    if (!CanvasRef.current || !localVideoRef.current) return;
    const localVideo = localVideoRef.current;

    const canvas = CanvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawFrame = () => {
      if (LocalStream && ScreenStream) {
        canvas.width = screenVideoRef.current.videoWidth;
        canvas.height = screenVideoRef.current.videoHeight;
        ctx.drawImage(
          screenVideoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const circleX = canvas.width - 110;
        const circleY = canvas.height - 110;
        const radius = 100;

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          localVideo,
          circleX - radius,
          circleY - radius,
          radius * 2,
          radius * 2
        );
        ctx.restore();
      } else {
        canvas.width = localVideo.videoWidth;
        canvas.height = localVideo.videoHeight;
        ctx.drawImage(localVideo, 0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(drawFrame);
    };

    drawFrame();

    const VideoTrack = canvas.captureStream().getTracks()[0];
    const sendersLength = PeerA.getSenders().length;

    if (sendersLength >= 2) {
      PeerA
        .getSenders()
        .filter((sender) => sender.track.kind === "video")[0]
        .replaceTrack(VideoTrack);
    }
  }, [PeerA, LocalStream, ScreenStream]);

  useEffect(() => {
    if (!LocalStream) return;

    const audioContext = new AudioContext();

    const destination = audioContext.createMediaStreamDestination();

    const localSource = audioContext.createMediaStreamSource(LocalStream);
    const localGain = audioContext.createGain();
    localGain.gain.setValueAtTime(1, audioContext.currentTime);

    localSource.connect(localGain);
    localGain.connect(destination);

    if (ScreenStream) {
      const screenSource = audioContext.createMediaStreamSource(ScreenStream);
      const screenGain = audioContext.createGain();
      screenGain.gain.setValueAtTime(1, audioContext.currentTime);

      screenSource.connect(screenGain);
      screenGain.connect(destination);
    }

    const AudioTrack = destination.stream.getTracks()[0];
    const sendersLength = PeerA.getSenders().length;

    if (sendersLength >= 2) {
      PeerA
        .getSenders()
        .filter((sender) => sender.track.kind === "audio")[0]
        .replaceTrack(AudioTrack);
    }
  }, [PeerA, LocalStream, ScreenStream]);

  useEffect(() => {
    if (RecorderStream) {
      const recorder = new MediaRecorder(RecorderStream);
      setMediaRecorder(recorder);

      recorder.onstop = async () => {
        const blob = new Blob(RecorderChunksRef.current, { type: "video/mp4" });

        const currentDate = new Date();
        const formattedDate = currentDate
          .toISOString()
          .replace(/:/g, "-")
          .split(".")[0]
          .replace("T", "_");

        const filename = `dialwhy-tutorial-recording_${formattedDate}.mp4`;

        const formData = new FormData();
        formData.append("video", blob, filename);
        formData.append("userId", userId);
        formData.append(
          "timing",
          currentDate.toLocaleTimeString([], {
            hour12: true,
            hour: "2-digit",
            minute: "2-digit",
          })
        );

        const result = await axios.post(
          `${appServer}/upload-tutorial`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (result.status === 200) {
          window.location.replace("/");
        }
      };

      recorder.ondataavailable = (ev) =>
        RecorderChunksRef.current.push(ev.data);
    }
  }, [RecorderStream, userId]);

  return (
    <div className="bg-dark">
      <div
        style={
          ScreenShareToggle
            ? {
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid white",
              }
            : {}
        }
      >
        <video
          disablePictureInPicture
          disableRemotePlayback
          ref={localVideoRef}
          playsInline
          autoPlay
          muted
          style={
            ScreenShareToggle
              ? {
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }
              : { width: "auto", margin: "auto", height: "100vh" }
          }
        ></video>
      </div>
      <video
        style={{ width: "auto", margin: "auto", height: "100vh" }}
        className={`${ScreenShareToggle ? "d-flex" : "d-none"}`}
        disablePictureInPicture
        disableRemotePlayback
        ref={screenVideoRef}
        playsInline
        autoPlay
        muted
      ></video>
      <div>
        <video
          className="d-none"
          disablePictureInPicture
          disableRemotePlayback
          ref={RecorderVideoRef}
          playsInline
          autoPlay
          muted
        ></video>
        {mediaRecorder?.state}
        <canvas ref={CanvasRef} className="w-0 h-0"></canvas>
      </div>
      <div className="position-fixed bottom-0 left-0 right-0 d-flex justify-content-center align-items-center text-light">
        {mediaRecorder && (
          <button
            className={`${
              RecorderState === "inactive" ? "bg-success" : "bg-danger"
            } p-3 rounded-full mx-3`}
            onClick={() => {
              ToggleRecording();
            }}
          >
            {RecorderState === "inactive" && <PlayArrowRounded />}
            {(RecorderState === "recording" || RecorderState === "paused") && (
              <Stop />
            )}
          </button>
        )}
        {mediaRecorder &&
          (RecorderState === "recording" || RecorderState === "paused") && (
            <button
              className="bg-success p-3 rounded-full mx-3"
              onClick={PauseToggler}
            >
              {RecorderState === "recording" ? <Pause /> : <PlayArrowRounded />}
            </button>
          )}
        <button
          className="bg-success p-3 rounded-full mx-3"
          onClick={() => {
            setMicToggle(!MicToggle);
          }}
        >
          {MicToggle ? <Mic /> : <MicOff />}
        </button>
        <button
          className="bg-success p-3 rounded-full mx-3"
          onClick={() => {
            setCamToggle(!CamToggle);
          }}
        >
          {CamToggle ? <VideocamOutlined /> : <VideocamOffOutlined />}
        </button>
        <button
          className="bg-success p-3 rounded-full mx-3"
          onClick={ShareScreen}
        >
          {!ScreenShareToggle ? (
            <ScreenSearchDesktopOutlined />
          ) : (
            <StopScreenShareOutlined />
          )}
        </button>
      </div>
    </div>
  );
};

export default RecordTut;
