import {
  // ScreenSearchDesktopOutlined,
  // StopScreenShareOutlined,
  VideocamOffOutlined,
  // RadioButtonChecked,
  VideocamOutlined,
  // ChevronRight,
  // ChevronLeft,
  CallEnd,
  MicOff,
  // Send,
  Mic,
} from "@mui/icons-material";
import sendNotification from "../../utils/sendNotifications";
import React, { useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
// import MessageBox from "../../Components/MessageBox";
import { useParams } from "react-router-dom";
import { appServer } from "../../utils";
import socket from "../../utils/socket";
import axios from "axios";
import "@tensorflow/tfjs";

function VirtualBackground() {
  const userImage =
    JSON.parse(localStorage.getItem("user"))?.image.url || "/Profile.png";
  const userName = JSON.parse(localStorage.getItem("user")).name;
  // const [IsCallRecording, setIsCallRecording] = useState(false);
  const [RemoteCamToggle, setRemoteCamToggle] = useState(true);
  const [RemoteMicToggle, setRemoteMicToggle] = useState(true);
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [PeerConnection, setPeerConnection] = useState(null);
  // const [RecorderCanvas, setRecorderCanvas] = useState(null);
  const [RemoteStream, setRemoteStream] = useState(null);
  const [CurrentChat, setCurrentChat] = useState(null);
  const [LocalStream, setLocalStream] = useState(null);
  const [MainStream, setMainStream] = useState(null);
  const virtualBackgroundImage = "/background.jpeg";
  const [CallStatus, setCallStatus] = useState("");
  const [CallAudio, setCallAudio] = useState(null);
  const [MicToggle, setMicToggle] = useState(true);
  const [CamToggle, setCamToggle] = useState(true);
  const [CamState, setCamState] = useState(false);
  const [MicState, setMicState] = useState(false);
  const RemoteVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const { callId } = useParams();
  const videoRef = useRef(null);
  const ws = socket;

  ws.connect();

  const getConstraints = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const constraints = {
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
    };

    if (!constraints.audio) {
      alert("Error: Not get any audio source.");
      // window.location.replace(prevRoute ? prevRoute : "/");
      window.location.replace("/");
    } else if (!constraints.video) {
      alert("Error: Not get any video source.");
    }

    return constraints;
  };

  const getMediaStream = async (constraint, type) => {
    let constraints = {};

    if (type === "video") {
      constraints = { video: constraint };
    } else if (type === "audio") {
      constraints = { audio: constraint };
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      return newStream;
    } catch (err) {
      return Error("an Error Occurred");
    }
  };

  const endCall = async () => {
    window.location.replace("/");
  };

  useEffect(() => {
    const handleCalling = async (data) => {
      if (data.to === userId) {
        ws.emit("receiver-busy", data);
      }
    };

    const handleRinging = (data) => {
      if (data.callId === callId && data.type === "single") {
        setCallStatus("Ringing...");
      }
    };

    const handleCallAccepted = (data) => {
      if (data.callId === callId) {
        setCallStatus("Call Accepted.");
        CallAudio && CallAudio.pause();
        setTimeout(() => setCallStatus(""), 2000);
      }
    };

    const handleCallDeclined = (data) => {
      if (data.callId === callId && data.from === userId) {
        setCallStatus("Call Declined.");
        CallAudio && CallAudio.pause();
        window.location.replace("/");
        // window.location.replace(prevRoute ? prevRoute : "/");
      }
    };

    const handleReceiverBusy = async (data) => {
      if (data.callId === callId && data.from === userId) {
        setCallStatus(`User is busy.`);
        CallAudio && CallAudio.pause();
        setTimeout(() => {
          window.location.replace("/");
          //   window.location.replace(prevRoute ? prevRoute : "/");
        }, 3000);
      }
    };

    const ChangeEventHandler = async (data) => {
      if (callId === data.call_id && CurrentChat._id === data.senderId) {
        if (data.type === "audio") {
          setRemoteMicToggle(!data.state);
        } else if (data.type === "video") {
          setRemoteCamToggle(!data.state);
        }
      }
    };
    
    ws.on("calling", handleCalling);
    ws.on("ringing", handleRinging);
    ws.on("declined", handleCallDeclined);
    ws.on("accepting", handleCallAccepted);
    ws.on("change-event", ChangeEventHandler);
    ws.on("receiver-busy", handleReceiverBusy);

    return () => {
      ws.off("calling", handleCalling);
      ws.off("ringing", handleRinging);
      ws.off("declined", handleCallDeclined);
      ws.off("accepting", handleCallAccepted);
      ws.off("change-event", ChangeEventHandler);
      ws.off("receiver-busy", handleReceiverBusy);
    };
  }, [CallAudio, CurrentChat?._id, callId, userId, ws]);

  useEffect(() => {
    const initVideoStream = async () => {
      try {
        const constraints = await getConstraints();

        const mainStream = new MediaStream();
        const videoStream = await getMediaStream(constraints.video, "video");
        const audioStream = await getMediaStream(constraints.audio, "audio");

        if (videoStream instanceof MediaStream) {
          mainStream.addTrack(videoStream.getVideoTracks()[0]);
          setCamToggle(true);
          ws.emit("change-event", {
            senderId: userId,
            call_id: callId,
            type: "video",
            state: true,
          });
        } else {
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = 1920;
          tempCanvas.height = 1080;

          const tempCtx = tempCanvas.getContext("2d");
          if (tempCtx) {
            tempCtx.fillStyle = "black";
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          }

          const blackStream = tempCanvas.captureStream();
          mainStream.addTrack(blackStream.getVideoTracks()[0]);
          setCamToggle(false);
          setCamState(true);
          ws.emit("change-event", {
            senderId: userId,
            call_id: callId,
            type: "video",
            state: false,
          });
        }

        if (audioStream instanceof MediaStream) {
          mainStream.addTrack(audioStream.getAudioTracks()[0]);
          setMicToggle(true);
          ws.emit("change-event", {
            senderId: userId,
            call_id: callId,
            type: "audio",
            state: true,
          });
        } else {
          setMicToggle(false);
          setMicState(true);
          ws.emit("change-event", {
            senderId: userId,
            call_id: callId,
            type: "audio",
            state: false,
          });
        }

        const video = videoRef.current;
        video.srcObject = videoStream;

        const net = await bodyPix.load();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const virtualImage = new Image();
        virtualImage.src = virtualBackgroundImage;

        const processFrame = async () => {
          try {
            const videoTrackEnabled = mainStream.getVideoTracks()[0].enabled;

            if (videoTrackEnabled) {
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
            } else {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;

              ctx.clearRect(0, 0, canvas.width, canvas.height);

              ctx.fillStyle = "black";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            requestAnimationFrame(processFrame);
          } catch (err) {
            console.log(err);
          }
        };

        const localStream = new MediaStream();

        const videoTrack = canvas.captureStream().getVideoTracks()[0];
        const audioTrack = mainStream.getAudioTracks()[0];

        localStream.addTrack(videoTrack);
        localStream.addTrack(audioTrack);

        setLocalStream(localStream);
        setMainStream(mainStream);

        processFrame();
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    if (videoRef.current || canvasRef.current) {
      initVideoStream();
    }
  }, [ws, userId, callId, videoRef.current, canvasRef.current]);

  useEffect(() => {
    if (!LocalStream) return;

    const callAudio = new Audio("/audios/callring2.mp3");
    setCallAudio(callAudio);

    const getCallDetails = async () => {
      try {
        const res = await axios.get(`${appServer}/api/v1/call/${callId}`);
        const data = res.data;
        return data;
      } catch (err) {
        return err;
      }
    };

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

    pc.addEventListener("iceconnectionstatechange", async () => {
      if (
        pc.iceConnectionState === "closed" ||
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed"
      ) {
        endCall();
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
      const callData = await getCallDetails();

      if (callData.receivers !== userId && callData.creatorId !== userId) {
        return window.location.replace("/");
      }

      const response = await axios.post(`${appServer}/api/v1/user/userId`, {
        userId:
          callData.creatorId === userId
            ? callData.receivers
            : callData.creatorId,
      });

      setCurrentChat(response.data);

      if (callData.creatorId === userId) {
        const notify = {
          _id: callData.receivers,
          title: `${userName} Calling...`,
          body: window.location.origin + "/vc/" + callId + "/",
          type: "one-to-one-call",
          icon: userImage,
          badge: userImage,
        };
        ws.emit("calling", {
          callId,
          from: userId,
          to: callData.receivers,
          type: callData.type,
        });
        sendNotification(notify);
        callAudio.play();
      } else {
        try {
          ws.emit("accepting", {
            callId,
            from: userId,
            to: callId.creatorId,
            type: callId.type,
          });
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.emit("offer", {
            offer,
            from: userId,
            to: callData.creatorId,
            type: callData.type,
          });
        } catch (err) {
          console.log(err);
        }
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

    const HandleOffer = async (data) => {
      const { offer, from, to } = data;
      if (to !== userId) return;

      try {
        await pc.setRemoteDescription(offer);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.emit("answer", { answer, from: userId, to: from });
      } catch (err) {
        console.log(err);
      }
    };

    const HandleAnswer = async (data) => {
      // eslint-disable-next-line no-unused-vars
      const { answer, from, to } = data;
      if (to !== userId) return;

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
  }, [LocalStream, PeerConnection, callId, userId, userImage, userName, ws]);

  useEffect(() => {
    if (MainStream) {
      const videoTrackEnabled = MainStream.getVideoTracks()[0].enabled;
      const audioTrackEnabled = MainStream.getAudioTracks()[0].enabled;

      if (!CamToggle && videoTrackEnabled) {
        MainStream.getVideoTracks()[0].enabled = CamToggle;
        LocalStream.getVideoTracks()[0].enabled = CamToggle;
        ws.emit("change-event", {
          senderId: userId,
          call_id: callId,
          type: "video",
          state: true,
        });
      } else if (CamToggle && !videoTrackEnabled) {
        MainStream.getVideoTracks()[0].enabled = CamToggle;
        LocalStream.getVideoTracks()[0].enabled = CamToggle;
        ws.emit("change-event", {
          senderId: userId,
          call_id: callId,
          type: "video",
          state: false,
        });
      }

      if (!MicToggle && audioTrackEnabled) {
        MainStream.getAudioTracks()[0].enabled = MicToggle;
        ws.emit("change-event", {
          senderId: userId,
          call_id: callId,
          type: "audio",
          state: true,
        });
      } else if (MicToggle && !audioTrackEnabled) {
        MainStream.getAudioTracks()[0].enabled = MicToggle;
        ws.emit("change-event", {
          senderId: userId,
          call_id: callId,
          type: "audio",
          state: false,
        });
      }
    }
  }, [MainStream, CamToggle, MicToggle, LocalStream, ws, userId, callId]);

  useEffect(() => {
    if (RemoteStream) {
      RemoteVideoRef.current.srcObject = RemoteStream;
    }
  }, [RemoteStream]);

  return (
    <div
      className="d-flex w-100 justify-content-center align-items-center position-relative bg-dark"
      style={{ height: "100vh" }}
    >
      {CallStatus !== "" && (
        <div
          className="position-fixed top-0 left-0 right-0 px-3 py-2 bg-primary text-white font-weight-bold"
          style={{ zIndex: 20 }}
        >
          {CallStatus}
        </div>
      )}
      <video ref={videoRef} className="d-none" autoPlay playsInline />
      <canvas
        className="position-absolute w-25 h-auto rounded"
        ref={canvasRef}
        style={{
          transform: "rotateY(180deg)",
          bottom: "5%",
          right: "5%",
          zIndex: 2,
        }}
      />
      <video
        className="h-100 w-auto"
        ref={RemoteVideoRef}
        playsInline
        autoPlay
      />
      <div
        className="position-fixed bottom-0 left-0 right-0 d-flex justify-content-center align-items-center"
        style={{ zIndex: 1, height: "15%" }}
      >
        <button
          className="p-3 mx-4 text-light bg-success rounded-full"
          onClick={() => setCamToggle(!CamToggle)}
          disabled={CamState}
        >
          {!CamToggle ? <VideocamOffOutlined /> : <VideocamOutlined />}
        </button>
        <button
          className="p-3 mx-4 text-light bg-success rounded-full"
          onClick={() => setMicToggle(!MicToggle)}
          disabled={MicState}
        >
          {!MicToggle ? <MicOff /> : <Mic />}
        </button>
        <button
          className="bg-danger text-light rounded-full p-3 mx-4"
          onClick={endCall}
        >
          <CallEnd />
        </button>
      </div>
    </div>
  );
}

export default VirtualBackground;
