import {
  ScreenSearchDesktopOutlined,
  StopScreenShareOutlined,
  VideocamOffOutlined,
  VideocamOutlined,
  MicOff,
  Stop,
  Mic,
  PlayArrowRounded,
  Pause,
} from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { appServer } from "../../utils";

const RecordTut = () => {
  const [ScreenShareToggle, setScreenShareToggle] = useState(false);
  const [RecorderState, setRecorderState] = useState("inactive");
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [ScreenStream, setScreenStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState();
  const [AudioRecorder, setAudioRecorder] = useState();
  const [LocalStream, setLocalStream] = useState();
  const [MicToggle, setMicToggle] = useState(true);
  const [CamToggle, setCamToggle] = useState(true);
  const RecorderChunksRef = useRef(null);
  const screenVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const CanvasRef = useRef(null);

  const ShareScreen = async () => {
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
  };

  const ToggleRecording = () => {
    if (mediaRecorder.state === "inactive") {
      mediaRecorder.start();
      AudioRecorder.start();
    } else {
      mediaRecorder.stop();
      AudioRecorder.stop();
    }
    setRecorderState(mediaRecorder.state);
  };

  const PauseToggler = () => {
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      AudioRecorder.pause();
    } else {
      mediaRecorder.resume();
      AudioRecorder.resume();
    }
    setRecorderState(mediaRecorder.state);
  };

  useEffect(() => {
    const startLocalStream = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: devices.filter((device) => device.kind === "videoinput")[0]
            ?.deviceId,
          width: { min: 640, ideal: 1920, max: 1920 },
          height: { min: 400, ideal: 1080 },
        },
        audio: {
          deviceId: devices.filter((device) => device.kind === "audioinput")[0]
            ?.deviceId,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      setLocalStream(localStream);

      return () => {
        localStream.getTracks().map((track) => track.stop());
      };
    };

    startLocalStream();
    return () => {
      startLocalStream();
    };
  }, []);

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
  }, [LocalStream, ScreenStream]);

  useEffect(() => {
    if (!LocalStream) return;

    const audioChunks = [];
    let sended = false;
    let audioRecorder;

    const setupAudio = () => {
      const audioContext = new AudioContext();

      const localSource = audioContext.createMediaStreamSource(LocalStream);
      const localGain = audioContext.createGain();
      localGain.gain.setValueAtTime(1, audioContext.currentTime);

      localSource.connect(localGain);

      const destination = audioContext.createMediaStreamDestination();
      localGain.connect(destination);

      if (ScreenStream) {
        const screenSource = audioContext.createMediaStreamSource(ScreenStream);
        const screenGain = audioContext.createGain();
        screenGain.gain.setValueAtTime(1, audioContext.currentTime);
        screenSource.connect(screenGain);
        screenGain.connect(destination);
      }

      audioRecorder = new MediaRecorder(destination.stream);
      if(AudioRecorder && AudioRecorder.state === "recording") {
        console.log(AudioRecorder.state);
        audioRecorder.start();
      } else if(AudioRecorder && AudioRecorder.state === "paused") {
        console.log(AudioRecorder.state);
        audioRecorder.start();
        audioRecorder.pause();
      }
      setAudioRecorder(audioRecorder);

      audioRecorder.addEventListener("dataavailable", (ev) => {
        audioChunks.push(ev.data);
      });

      audioRecorder.addEventListener("stop", async () => {
        if (!sended) {
          sended = true;

          const currentDate = new Date();
          const formattedDate = currentDate
            .toISOString()
            .replace(/:/g, "-")
            .split(".")[0]
            .replace("T", "_");

          const videoFile = `video-wiredtalk-tutorial-recording_${formattedDate}.mp4`;
          const audioFile = `audio-wiredtalk-tutorial-recording_${formattedDate}.mp3`;

          const videoBlob = new Blob([RecorderChunksRef.current], {
            type: "video/mp4",
          });
          const audioBlob = new Blob(audioChunks, { type: "video/mp3" });

          const formData = new FormData();
          formData.append("video", videoBlob, videoFile);
          formData.append("audio", audioBlob, audioFile);
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
        }
      });
    };

    setupAudio();
    return () => {
      setupAudio();
    };
  }, [LocalStream, ScreenStream, userId]);

  useEffect(() => {
    const canvas = CanvasRef.current;
    const stream = canvas.captureStream();
    const recorder = mediaRecorder || new MediaRecorder(stream);
    !mediaRecorder && setMediaRecorder(recorder);

    recorder.addEventListener(
      "dataavailable",
      (ev) => (RecorderChunksRef.current = ev.data)
    );
  }, [mediaRecorder]);

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
