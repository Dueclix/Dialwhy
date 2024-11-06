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
  const [ScreenShareToggle, setScreenShareToggle] = useState(false);
  const CanvasVideoRef = useRef(document.createElement("video"));
  const [RecorderState, setRecorderState] = useState("inactive");
  const [PeerScreenStream, setPeerScreenStream] = useState(null);
  const [PeerLocalStream, setPeerLocalStream] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const CanvasRef = useRef(document.createElement("canvas"));
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [ScreenStream, setScreenStream] = useState(null);
  const [CanvasStream, setCanvasStream] = useState(null);
  const AudioContextRef = useRef(new AudioContext());
  const [LocalStream, setLocalStream] = useState(null);
  const [AudioDest, setAudioDest] = useState(null);
  const [MicToggle, setMicToggle] = useState(true);
  const [CamToggle, setCamToggle] = useState(true);
  const PeerScreenVideoRef = useRef(null);
  const PeerLocalVideoRef = useRef(null);
  const RecorderChunksRef = useRef(null);
  const peerBRef = useRef(null);
  const peerARef = useRef(null);

  const ScreenShare = async () => {
    try {
      const newState = !ScreenShareToggle;

      if (newState) {
        let stream;

        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
        } catch (err) {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
        }
        setScreenStream(stream);

        stream.getTracks().forEach((track) =>
          track.addEventListener("ended", () => {
            setScreenShareToggle(false);
            setPeerScreenStream(null);
            setScreenStream(null);
          })
        );
      } else {
        if (ScreenStream) {
          ScreenStream.getTracks().forEach((track) => track.stop());
          setPeerScreenStream(null);
          setScreenStream(null);
        }
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
    const peering = async () => {
      peerARef.current = new RTCPeerConnection(RTCPeerConfig);
      peerBRef.current = new RTCPeerConnection(RTCPeerConfig);

      if (LocalStream) {
        LocalStream.getTracks().forEach((track) => {
          peerARef.current.addTrack(track, LocalStream);
        });
      }

      if (ScreenStream) {
        ScreenStream.getTracks().forEach((track) => {
          peerARef.current.addTrack(track, ScreenStream);
        });
      }

      if (CanvasStream && !CanvasVideoRef.current.srcObject) {
        CanvasStream.getTracks().map((track) =>
          peerBRef.current.addTrack(track, CanvasStream)
        );
      }

      peerARef.current.ontrack = (event) => {
        CanvasVideoRef.current.srcObject = event.streams[0];
        CanvasVideoRef.current.playsInline = true;
        CanvasVideoRef.current.autoplay = true;
        CanvasVideoRef.current.muted = true;

        const recorder = new MediaRecorder(event.streams[0]);
        setMediaRecorder(recorder);

        recorder.addEventListener(
          "dataavailable",
          (ev) => (RecorderChunksRef.current = ev.data)
        );

        recorder.addEventListener("stop", async () => {
          const blob = new Blob([RecorderChunksRef.current], {
            type: "video/webm",
          });

          const formData = new FormData();
          formData.append("video", blob);
          formData.append("userId", userId);

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
      };

      peerBRef.current.ontrack = (event) => {
        const incomingStream = event.streams[0];

        if (incomingStream.id === LocalStream.id) {
          setPeerLocalStream(incomingStream);
          PeerLocalVideoRef.current.srcObject = incomingStream;
        } else if (incomingStream.id === ScreenStream.id) {
          setPeerScreenStream(incomingStream);
          PeerScreenVideoRef.current.srcObject = incomingStream;
        }
      };

      peerARef.current.onicecandidate = (event) => {
        if (event.candidate) {
          peerBRef.current.addIceCandidate(event.candidate).catch((error) => {
            console.error("Error adding ICE candidate to peerB:", error);
          });
        }
      };

      peerBRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          peerARef.current.addIceCandidate(event.candidate).catch((error) => {
            console.error("Error adding ICE candidate to peerA:", error);
          });
        }
      };

      const offer = await peerARef.current.createOffer();
      await peerARef.current.setLocalDescription(offer);
      await peerBRef.current.setRemoteDescription(offer);

      const answer = await peerBRef.current.createAnswer();
      await peerBRef.current.setLocalDescription(answer);
      await peerARef.current.setRemoteDescription(answer);
    };

    peering().catch((error) => {
      console.error("Error during peer connection setup:", error);
    });

    return () => {
      if (peerARef.current) {
        peerARef.current.close();
      }
      if (peerBRef.current) {
        peerBRef.current.close();
      }
    };
  }, [CanvasStream, LocalStream, ScreenStream, userId]);

  useEffect(() => {
    const init = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInput = devices.find((device) => device.kind === "videoinput");
      const audioInput = devices.find((device) => device.kind === "audioinput");

      const stream = await navigator.mediaDevices.getUserMedia({
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
      setLocalStream(stream);
    };

    init();
  }, []);

  useEffect(() => {
    if (LocalStream) {
      const videoTrackEnabled = LocalStream.getVideoTracks()[0].enabled;
      const audioTrackEnabled = LocalStream.getAudioTracks()[0].enabled;

      if (!CamToggle && videoTrackEnabled) {
        LocalStream.getVideoTracks()[0].enabled = CamToggle;
      } else if (CamToggle && !videoTrackEnabled) {
        LocalStream.getVideoTracks()[0].enabled = CamToggle;
      }

      if (!MicToggle && audioTrackEnabled) {
        LocalStream.getAudioTracks()[0].enabled = MicToggle;
      } else if (MicToggle && !audioTrackEnabled) {
        LocalStream.getAudioTracks()[0].enabled = MicToggle;
      }
    }
  }, [LocalStream, CamToggle, MicToggle]);

  useEffect(() => {
    if (!LocalStream) return;

    const destination = AudioContextRef.current.createMediaStreamDestination();

    const localSource =
      AudioContextRef.current.createMediaStreamSource(LocalStream);
    const localGain = AudioContextRef.current.createGain();
    localGain.gain.setValueAtTime(1, AudioContextRef.current.currentTime);

    localSource.connect(localGain);
    localGain.connect(destination);

    if (ScreenStream && ScreenStream.getAudioTracks().length > 0) {
      const screenSource =
        AudioContextRef.current.createMediaStreamSource(ScreenStream);
      const screenGain = AudioContextRef.current.createGain();
      screenGain.gain.setValueAtTime(1, AudioContextRef.current.currentTime);

      screenSource.connect(screenGain);
      screenGain.connect(destination);
    }

    setAudioDest(destination);
  }, [LocalStream, ScreenStream]);

  useEffect(() => {
    if (!CanvasRef.current || !PeerLocalStream) return;

    const localVideo = document.createElement("video");
    localVideo.srcObject = new MediaStream(PeerLocalStream.getVideoTracks());
    localVideo.playsInline = true;
    localVideo.autoplay = true;

    const screenVideo = document.createElement("video");
    screenVideo.srcObject =
      PeerScreenStream && new MediaStream(PeerScreenStream.getVideoTracks());
    screenVideo.playsInline = true;
    screenVideo.autoplay = true;

    const ctx = CanvasRef.current.getContext("2d");

    const drawFrame = () => {
      if (PeerLocalStream && PeerScreenStream) {
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

      requestAnimationFrame(drawFrame);
    };

    drawFrame();
  }, [PeerLocalStream, PeerScreenStream]);

  useEffect(() => {
    if (CanvasRef.current && AudioDest) {
      if (peerBRef.current.getSenders().length >= 2) {
        const stream = CanvasRef.current.captureStream();
        stream.addTrack(AudioDest.stream.getTracks()[0]);

        stream.getTracks().map((track) =>
          peerBRef.current
            .getSenders()
            .filter((sender) => sender.track.kind === track.kind)[0]
            .replaceTrack(track)
        );
      } else {
        const stream = CanvasRef.current.captureStream();
        stream.addTrack(AudioDest.stream.getTracks()[0]);
        setCanvasStream(stream);
      }
    }
  }, [AudioDest]);

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
          ref={PeerLocalVideoRef}
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
