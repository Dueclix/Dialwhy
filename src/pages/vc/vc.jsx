import {
  CallEnd,
  Mic,
  MicOff,
  ScreenSearchDesktopOutlined,
  StopScreenShareOutlined,
  VideocamOffOutlined,
  VideocamOutlined,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { appServer } from "../../utils";
import socket from "../../utils/socket";
import axios from "axios";

function VC() {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [peerConnection, setPeerConnection] = useState(null);
  const [IsScreenShare, setIsScreenShare] = useState(false);
  const [CameraEnable, setCameraEnable] = useState(true);
  const [LocalStream, setLocalStream] = useState(null);
  const [CurrentChat, setCurrentChat] = useState(null);
  const [RemoteVideo, setRemoteVideo] = useState(true);
  const [RemoteAudio, setRemoteAudio] = useState(true);
  const [MicEnable, setMicEnable] = useState(true);
  const [CallStatus, setCallStatus] = useState("");
  const [CallAudio, setCallAudio] = useState(null);
  const remoteVideoRef = useRef();
  const localVideoRef = useRef();
  const { callId } = useParams();
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
        facingMode: { exact: "user" },
      },
      audio: {
        deviceId: devices.filter((device) => device.kind === "audioinput")[0]
          ?.deviceId,
      },
    };

    if (!constraints.audio) {
      alert("Error: Not get any audio source.");
      //   window.location.replace(prevRoute ? prevRoute : "/");
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

  const createSilentAudioStream = () => {
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    const buffer = audioContext.createBuffer(
      1,
      audioContext.sampleRate,
      audioContext.sampleRate
    );
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(destination);
    source.start();

    return destination.stream;
  };

  const toggleCamera = async () => {
    const newState = !CameraEnable;
    const localStream = LocalStream;

    if (newState) {
      const constraints = await getConstraints();
      const videoStream = await getMediaStream(constraints.video, "video");
      if (videoStream instanceof MediaStream) {
        localStream
          .getVideoTracks()
          .forEach((track) => localStream.removeTrack(track));

        videoStream.getVideoTracks().forEach((track) => {
          localStream.addTrack(track);
          if (peerConnection?.signalingState !== "closed") {
            peerConnection?.getSenders().forEach((sender) => {
              if (sender.track?.kind === "video") {
                sender.replaceTrack(track);
              }
            });
          }
        });
      }
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const blackStream = canvas.captureStream();
      const blackVideoTrack = blackStream.getVideoTracks()[0];

      localStream.getVideoTracks().forEach((track) => {
        localStream.removeTrack(track);
      });

      localStream.addTrack(blackVideoTrack);
      if (peerConnection?.signalingState !== "closed") {
        peerConnection?.getSenders().forEach((sender) => {
          if (sender.track?.kind === "video") {
            sender.replaceTrack(blackVideoTrack);
          }
        });
      }
    }

    socket.emit("change-event", {
      call_id: callId,
      state: newState,
      userId: userId,
      type: "audio",
    });
    setLocalStream(localStream);
    setCameraEnable(newState);
  };
  const toggleMic = async () => {
    const localStream = LocalStream;
    const newState = !MicEnable;

    if (newState) {
      const constraints = await getConstraints();
      const audioStream = await getMediaStream(constraints.audio, "audio");

      if (audioStream instanceof MediaStream) {
        localStream.getAudioTracks().forEach((track) => {
          localStream.removeTrack(track);
        });

        audioStream.getAudioTracks().forEach((track) => {
          localStream.addTrack(track);
          if (peerConnection && peerConnection.signalingState !== "closed") {
            peerConnection
              .getSenders()
              .filter((sender) => sender.track?.kind === "audio")
              .forEach((sender) => sender.replaceTrack(track));
          }
        });
      }
    } else {
      localStream
        .getAudioTracks()
        .forEach((track) => localStream.removeTrack(track));

      const silentAudioTrack = createSilentAudioStream().getAudioTracks()[0];
      localStream.addTrack(silentAudioTrack);
      if (peerConnection && peerConnection.signalingState !== "closed") {
        peerConnection
          .getSenders()
          .filter((sender) => sender.track?.kind === "audio")
          .forEach((sender) => sender.replaceTrack(silentAudioTrack));
      }
    }

    socket.emit("change-event", {
      call_id: callId,
      state: newState,
      userId: userId,
      type: "audio",
    });
    setLocalStream(localStream);
    setMicEnable(newState);
  };

  const restartStream = async () => {
    const prevLocalStream = LocalStream;

    if (CameraEnable) {
      const constraints = await getConstraints();
      const videoStream = await getMediaStream(constraints.video, "video");

      if (videoStream instanceof MediaStream) {
        prevLocalStream.getVideoTracks().forEach((track) => {
          track.stop();
          prevLocalStream.removeTrack(track);
        });
        videoStream.getVideoTracks().forEach((track) => {
          prevLocalStream?.addTrack(track);
          if (peerConnection?.signalingState !== "closed") {
            peerConnection?.getSenders().forEach((sender) => {
              if (sender.track?.kind !== "audio") {
                sender.replaceTrack(track);
              }
            });
          }
        });
      }
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const blackStream = canvas.captureStream();
      const blackVideoTrack = blackStream.getVideoTracks()[0];

      prevLocalStream?.addTrack(blackVideoTrack);
      if (peerConnection?.signalingState !== "closed") {
        peerConnection?.getSenders().forEach((sender) => {
          if (sender.track?.kind !== "audio") {
            sender.replaceTrack(blackVideoTrack);
          }
        });
      }
    }
    setLocalStream(prevLocalStream);
  };

  const screenShare = async () => {
    if (!IsScreenShare) {
      await navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: false })
        .then((stream) => {
          const prevLocalStream = LocalStream;
          prevLocalStream
            ?.getVideoTracks()
            .map((track) => prevLocalStream.removeTrack(track));

          stream.getVideoTracks().forEach((track) => {
            prevLocalStream?.addTrack(track);
            if (peerConnection?.signalingState !== "closed") {
              peerConnection?.getSenders().forEach((sender) => {
                if (sender.track?.kind !== "audio") {
                  sender.replaceTrack(track);
                }
              });
            }
            track.addEventListener("ended", (ev) => {
              restartStream();
              setIsScreenShare(false);
            });
          });

          setLocalStream(prevLocalStream);
          if (!CameraEnable) {
            socket.emit("change-event", {
              state: true,
              type: "video",
              call_id: callId,
              userId: userId,
            });
            setCameraEnable(true);
          }
          setIsScreenShare(!IsScreenShare);
        })
        .catch((err) => console.log(err));
    } else {
      restartStream();
      setIsScreenShare(!IsScreenShare);
    }
  };

  const endCall = async () => {
    window.location.replace("/");
  };

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.emit("ice-candidate", event.candidate);
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.addEventListener("iceconnectionstatechange", async () => {
      if (
        pc.iceConnectionState === "closed" ||
        pc.iceConnectionState === "disconnected" ||
        pc.iceConnectionState === "failed"
      ) {
        endCall();
      }
    });

    setPeerConnection(pc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleIncomingOffer = async (data) => {
      const { offer, from, to } = data;
      if (to !== userId || !peerConnection) return;

      try {
        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        ws.emit("answer", { answer, from: userId, to: from });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const handleIncomingAnswer = async (data) => {
      // eslint-disable-next-line no-unused-vars
      const { answer, from, to } = data;
      if (to !== userId || !peerConnection) return;

      try {
        await peerConnection.setRemoteDescription(answer);
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    };

    const handleIncomingIceCandidate = async (candidate) => {
      if (!peerConnection) return;

      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (error) {
        console.error("Error adding received ICE candidate:", error);
      }
    };

    ws.on("offer", handleIncomingOffer);
    ws.on("answer", handleIncomingAnswer);
    ws.on("ice-candidate", handleIncomingIceCandidate);

    return () => {
      ws.off("offer", handleIncomingOffer);
      ws.off("answer", handleIncomingAnswer);
      ws.off("ice-candidate", handleIncomingIceCandidate);
    };
  }, [peerConnection, userId, ws]);

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

    const ChangeEvent = (data) => {
      if (callId === data.call_id && CurrentChat._id === data.senderId) {
        if (data.type === "audio") {
          setRemoteAudio(!data.state);
        } else if (data.type === "video") {
          setRemoteVideo(!data.state);
        }
      }
    };

    ws.on("calling", handleCalling);
    ws.on("ringing", handleRinging);
    ws.on("change-event", ChangeEvent);
    ws.on("declined", handleCallDeclined);
    ws.on("accepting", handleCallAccepted);
    ws.on("receiver-busy", handleReceiverBusy);

    return () => {
      ws.off("calling", handleCalling);
      ws.off("ringing", handleRinging);
      ws.off("change-event", ChangeEvent);
      ws.off("declined", handleCallDeclined);
      ws.off("accepting", handleCallAccepted);
      ws.off("receiver-busy", handleReceiverBusy);
    };
  }, [userId, callId, ws, CallAudio, CurrentChat?._id]);

  useEffect(() => {
    setCallAudio(new Audio("/audios/callring2.mp3"));

    const getCallDetails = async () => {
      try {
        const res = await axios.get(`${appServer}/api/v1/call/${callId}`);
        const data = res.data;
        return data;
      } catch (err) {
        return err;
      }
    };

    const startCall = async () => {
      if (!peerConnection || LocalStream) return;

      const callData = await getCallDetails();

      if (callData.receivers !== userId && callData.creatorId !== userId)
        return;

      const response = await axios.post(`${appServer}/api/v1/user/userId`, {
        userId:
          callData.creatorId === userId
            ? callData.receivers
            : callData.creatorId,
      });

      setCurrentChat(response.data);

      const constraints = await getConstraints();
      const mediaStream = new MediaStream();

      const audioStream = await getMediaStream(constraints.audio, "audio");
      const videoStream = await getMediaStream(constraints.video, "video");

      if (audioStream instanceof MediaStream) {
        audioStream.getTracks().map((track) => mediaStream.addTrack(track));
        setMicEnable(true);
      } else {
        setMicEnable(false);
      }

      if (videoStream instanceof MediaStream) {
        videoStream.getTracks().map((track) => mediaStream.addTrack(track));
        setCameraEnable(true);
      } else {
        setCameraEnable(false);
      }

      setLocalStream(mediaStream);

      mediaStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, mediaStream));

      if (callData.receivers === userId) {
        ws.emit("accepting", {
          callId,
          from: userId,
          to: callId.creatorId,
          type: callId.type,
        });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        ws.emit("offer", {
          offer,
          from: userId,
          to: callData.creatorId,
          type: callData.type,
        });
      } else if (callData.creatorId === userId) {
        ws.emit("calling", {
          callId,
          from: userId,
          to: callData.receivers,
          type: callData.type,
        });
      }
    };

    startCall();
  }, [LocalStream, callId, peerConnection, userId, ws]);

  useEffect(() => {
    if (LocalStream && localVideoRef.current) {
      localVideoRef.current.srcObject = LocalStream;
    }
  }, [LocalStream]);

  return (
    <div>
      {CallStatus !== "" && (
        <div
          className="position-fixed top-0 left-0 right-0 px-3 py-2 bg-primary text-white font-weight-bold"
          style={{ zIndex: 20 }}
        >
          {CallStatus}
        </div>
      )}
      <div
        className="bg-dark position-relative w-100"
        style={{ zIndex: 10, height: "100vh" }}
      >
        <video
          style={{
            zIndex: 2,
            bottom: "5%",
            right: "5%",
            transform: "rotateY(180deg)",
          }}
          className="w-25 h-auto position-absolute rounded"
          disablePictureInPicture
          disableRemotePlayback
          ref={localVideoRef}
          controls={false}
          playsInline
          autoPlay
          muted
        ></video>
        <video
          className="w-100 h-100 rounded"
          disablePictureInPicture
          disableRemotePlayback
          style={{ zIndex: 1 }}
          ref={remoteVideoRef}
          controls={false}
          autoPlay
        ></video>
      </div>
      <div
        className="position-fixed right-0 bottom-0 left-0 text-center mb-4"
        style={{ zIndex: 20 }}
      >
        <button
          className="bg-success text-light rounded-full p-3 mx-4"
          onClick={toggleCamera}
        >
          {!CameraEnable ? <VideocamOffOutlined /> : <VideocamOutlined />}
        </button>
        <button
          className="bg-success text-light rounded-full p-3 mx-4"
          onClick={toggleMic}
        >
          {!MicEnable ? <MicOff /> : <Mic />}
        </button>
        <button
          className="bg-success text-light rounded-full p-3 mx-4"
          onClick={screenShare}
        >
          {!IsScreenShare ? (
            <ScreenSearchDesktopOutlined />
          ) : (
            <StopScreenShareOutlined />
          )}
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

export default VC;
