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
import axios from "axios";

const RTCPeerConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const RecordTut = () => {
  const [PeerScreenStream, setPeerScreenStream] = useState(null);
  const [RecorderState, setRecorderState] = useState("inactive");
  const [PeerUserStream, setPeerUserStream] = useState(null);
  const CanvasRef = useRef(document.createElement("canvas"));
  const [IsScreenShare, setIsScreenShare] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [ScreenStream, setScreenStream] = useState(null);
  const [UserStream, setUserStream] = useState(null);
  const [MicToggle, setMicToggle] = useState(true);
  const [CamToggle, setCamToggle] = useState(true);
  const PeerScreenVideoRef = useRef(null);
  const RecorderChunksRef = useRef(null);
  const PeerUserVideoRef = useRef(null);
  const PeerARef = useRef(null);

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

  const ScreenShare = async () => {
    const newState = !IsScreenShare;

    if (newState) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setScreenStream(stream);

      stream.getTracks().forEach((track) =>
        track.addEventListener("ended", () => {
          setPeerScreenStream(null);
          setIsScreenShare(false);
          setScreenStream(null);
        })
      );
    } else if (!newState && ScreenStream) {
      ScreenStream.getTracks().forEach((track) => track.stop());
      setPeerScreenStream(null);
      setScreenStream(null);
    }

    setIsScreenShare(newState);
  };

  useEffect(() => {
    const UserPeer = new RTCPeerConnection(RTCPeerConfig);
    const ScreenPeer = new RTCPeerConnection(RTCPeerConfig);

    UserPeer.addEventListener("track", (ev) => {
      setPeerScreenStream(ev.streams[0]);
    });

    ScreenPeer.addEventListener("track", (ev) => {
      setPeerUserStream(ev.streams[0]);
    });

    UserPeer.addEventListener("icecandidate", (ev) => {
      ScreenPeer.addIceCandidate(ev.candidate);
    });

    ScreenPeer.addEventListener("icecandidate", (ev) => {
      UserPeer.addIceCandidate(ev.candidate);
    });

    const connectPeers = async () => {
      if (UserStream) {
        UserStream.getTracks().map((track) =>
          UserPeer.addTrack(track, UserStream)
        );
      }

      if (ScreenStream) {
        ScreenStream.getTracks().map((track) =>
          ScreenPeer.addTrack(track, ScreenStream)
        );
      }

      const offer = await UserPeer.createOffer();
      UserPeer.setLocalDescription(offer);
      ScreenPeer.setRemoteDescription(offer);

      const answer = await ScreenPeer.createAnswer();
      ScreenPeer.setLocalDescription(answer);
      UserPeer.setRemoteDescription(answer);
    };

    connectPeers();

    return () => {
      UserPeer.close();
      ScreenPeer.close();
    };
  }, [UserStream, ScreenStream]);

  useEffect(() => {
    const PeerA = new RTCPeerConnection(RTCPeerConfig);
    const PeerB = new RTCPeerConnection(RTCPeerConfig);
    PeerARef.current = PeerA;

    PeerB.addEventListener("track", (ev) => {
      const recorder = new MediaRecorder(ev.streams[0]);
      setMediaRecorder(recorder);

      recorder.addEventListener(
        "dataavailable",
        (ev) => (RecorderChunksRef.current = ev.data)
      );

      recorder.addEventListener("stop", async () => {
        const blob = new Blob([RecorderChunksRef.current], {
          type: "video/mp4",
        });

        const formData = new FormData();
        formData.append("video", blob);
        formData.append("userId", JSON.parse(localStorage.getItem("user"))._id);

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
      });
    });

    PeerA.addEventListener("icecandidate", (ev) => {
      PeerB.addIceCandidate(ev.candidate);
    });

    PeerB.addEventListener("icecandidate", (ev) => {
      PeerA.addIceCandidate(ev.candidate);
    });

    const connectPeers = async () => {
      if (UserStream) {
        UserStream.getTracks().map((track) =>
          PeerA.addTrack(track, UserStream)
        );
      }

      const offer = await PeerA.createOffer();
      PeerA.setLocalDescription(offer);
      PeerB.setRemoteDescription(offer);

      const answer = await PeerB.createAnswer();
      PeerB.setLocalDescription(answer);
      PeerA.setRemoteDescription(answer);
    };

    connectPeers();

    return () => {
      PeerA.close();
      PeerB.close();
    };
  }, [UserStream]);

  useEffect(() => {
    if (!PeerUserStream) return;

    const context = new AudioContext(PeerUserStream);

    const destination = context.createMediaStreamDestination();

    const localSource = context.createMediaStreamSource(PeerUserStream);
    const localGain = context.createGain();
    localGain.gain.setValueAtTime(1, context.currentTime);

    localSource.connect(localGain);
    localGain.connect(destination);

    if (PeerScreenStream && PeerScreenStream.getAudioTracks().length > 0) {
      const screenSource = context.createMediaStreamSource(PeerScreenStream);
      const screenGain = context.createGain();
      screenGain.gain.setValueAtTime(1, context.currentTime);

      screenSource.connect(screenGain);
      screenGain.connect(destination);
    }

    if (PeerARef.current && PeerARef.current.getSenders().length > 0) {
      PeerARef.current
        .getSenders()
        .filter((sender) => sender.track.kind === "audio")[0]
        .replaceTrack(destination.stream.getAudioTracks()[0]);
    }
  }, [PeerUserStream, PeerScreenStream]);

  useEffect(() => {
    if (!CanvasRef.current || !PeerUserStream) return;

    const localVideo = document.createElement("video");
    localVideo.srcObject = new MediaStream(PeerUserStream.getVideoTracks());
    localVideo.playsInline = true;
    localVideo.autoplay = true;

    const screenVideo = document.createElement("video");
    screenVideo.srcObject =
      PeerScreenStream && new MediaStream(PeerScreenStream.getVideoTracks());
    screenVideo.playsInline = true;
    screenVideo.autoplay = true;

    const ctx = CanvasRef.current.getContext("2d");

    const drawFrame = () => {
      if (PeerScreenStream) {
        CanvasRef.current.width = screenVideo.videoWidth;
        CanvasRef.current.height = screenVideo.videoHeight;
        ctx.drawImage(
          screenVideo,
          0,
          0,
          CanvasRef.current.width,
          CanvasRef.current.height
        );

        const circleX = CanvasRef.current.width - 110;
        const circleY = CanvasRef.current.height - 110;
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
        CanvasRef.current.width = localVideo.videoWidth;
        CanvasRef.current.height = localVideo.videoHeight;
        ctx.drawImage(
          localVideo,
          0,
          0,
          CanvasRef.current.width,
          CanvasRef.current.height
        );
      }
    };

    const intervalId = setInterval(drawFrame, 1000 / 60);
    if (PeerARef.current && PeerARef.current.getSenders().length > 0) {
      PeerARef.current
        .getSenders()
        .filter((sender) => sender.track.kind === "video")[0]
        .replaceTrack(CanvasRef.current.captureStream().getVideoTracks()[0]);
    }
    return () => clearInterval(intervalId);
  }, [PeerUserStream, PeerScreenStream]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => setUserStream(stream));
  }, []);

  useEffect(() => {
    if (UserStream) {
      const videoTrackEnabled = UserStream.getVideoTracks()[0].enabled;
      const audioTrackEnabled = UserStream.getAudioTracks()[0].enabled;

      if (!CamToggle && videoTrackEnabled) {
        UserStream.getVideoTracks()[0].enabled = CamToggle;
      } else if (CamToggle && !videoTrackEnabled) {
        UserStream.getVideoTracks()[0].enabled = CamToggle;
      }

      if (!MicToggle && audioTrackEnabled) {
        UserStream.getAudioTracks()[0].enabled = MicToggle;
      } else if (MicToggle && !audioTrackEnabled) {
        UserStream.getAudioTracks()[0].enabled = MicToggle;
      }
    }
  }, [UserStream, CamToggle, MicToggle]);

  useEffect(() => {
    if (PeerUserVideoRef.current && PeerUserStream) {
      PeerUserVideoRef.current.srcObject = PeerUserStream;
    } else if (PeerUserVideoRef.current) {
      PeerUserVideoRef.current.srcObject = null;
    }
  }, [PeerUserStream]);

  useEffect(() => {
    if (PeerScreenVideoRef.current && PeerScreenStream) {
      PeerScreenVideoRef.current.srcObject = PeerScreenStream;
    } else if (PeerScreenVideoRef.current) {
      PeerScreenVideoRef.current.srcObject = null;
    }
  }, [PeerScreenStream]);

  return (
    <div className="bg-dark">
      <div
        style={
          IsScreenShare
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
          ref={PeerUserVideoRef}
          playsInline
          autoPlay
          muted
          style={
            IsScreenShare
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
        className={`${IsScreenShare ? "d-flex" : "d-none"}`}
        disablePictureInPicture
        disableRemotePlayback
        ref={PeerScreenVideoRef}
        playsInline
        autoPlay
        muted
      ></video>
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
          onClick={ScreenShare}
        >
          {!IsScreenShare ? (
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
