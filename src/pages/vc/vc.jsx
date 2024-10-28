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
  Mic,
  Send,
} from "@mui/icons-material";
import sendNotification from "../../utils/sendNotifications";
import React, { useEffect, useRef, useState } from "react";
import MessageBox from "../../Components/MessageBox";
import { useParams } from "react-router-dom";
import { appServer } from "../../utils";
import socket from "../../utils/socket";
import axios from "axios";

function VC() {
  const userImage =
    JSON.parse(localStorage.getItem("user"))?.image.url || "/Profile.png";
  const userName = JSON.parse(localStorage.getItem("user")).name;
  const [IsCallRecording, setIsCallRecording] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [peerConnection, setPeerConnection] = useState(null);
  // const [RecorderCanvas, setRecorderCanvas] = useState(null);
  // const [UpdatesMessage, setUpdatesMessage] = useState(null);
  // const [mediaRecorder, setMediaRecorder] = useState(null);
  // const [AudioRecorder, setAudioRecorder] = useState(null);
  const [IsScreenShare, setIsScreenShare] = useState(false);
  // const [RecordedVideo, setRecordedVideo] = useState(null);
  // const [RecorderAudio, setRecorderAudio] = useState(true);
  // const [audioContext, setAudioContext] = useState(null);
  const [CameraEnable, setCameraEnable] = useState(true);
  const [RemoteStream, setRemoteStream] = useState(null);
  // const [IsRecording, setIsRecording] = useState(false);
  const [MessagesList, setMessagesList] = useState([]);
  const [LocalStream, setLocalStream] = useState(null);
  const [CurrentChat, setCurrentChat] = useState(null);
  const [RemoteVideo, setRemoteVideo] = useState(true);
  const [RemoteAudio, setRemoteAudio] = useState(true);
  const [ToggleChat, setToggleChat] = useState("-22%");
  // const [AudioChunks, setAudioChunks] = useState([]);
  const [RecordedBy, setRecordedBy] = useState(null);
  const [MicEnable, setMicEnable] = useState(true);
  const [CallStatus, setCallStatus] = useState("");
  const [CallAudio, setCallAudio] = useState(null);
  const [EditValue, setEditValue] = useState("");
  const [Message, setMessage] = useState("");
  const [EditId, setEditId] = useState("");
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

  const sendMessage = async () => {
    const currentDate = new Date();
    const data = {
      senderId: userId,
      receiverId: CurrentChat._id,
      message: Message,
      timming: currentDate.toLocaleTimeString([], {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      }),
      seen: false,
    };

    const notify = {
      _id: CurrentChat._id,
      title: `New Message From ${userName}`,
      type: "one-to-one-message",
      body: Message,
      icon: userImage,
      badge: userImage,
    };

    await axios
      .post(`${appServer}/api/v1/message/one-to-one/send`, data)
      .then((res) => {
        ws.emit("one-to-one-message", { _id: res.data, ...data });
        setMessage("");
      });

    sendNotification(notify);
  };

  const deleteMessage = async (messageId) => {
    try {
      const result = await axios.post(
        `${appServer}/api/v1/message/one-to-one/delete/`,
        { messageId }
      );

      if (result.status === 200) {
        setMessagesList((prevMessagesList) =>
          prevMessagesList.filter((message) => message._id !== messageId)
        );
        socket.emit("one-to-one-delete", { messageId: messageId });
      } else {
        console.error("Failed to delete message:", result.statusText);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const CencelEditedMessage = () => {
    setEditId("");
    setEditValue("");
  };

  const sendEditMessage = async () => {
    if (EditId.trim() !== "" && EditValue.trim() !== "") {
      const result = await axios.post(
        `${appServer}/api/v1/message/one-to-one/edit`,
        { messageId: EditId, updatedMessage: EditValue }
      );

      if (result.status === 200) {
        const index = MessagesList.findIndex(
          (message) => message._id === EditId
        );

        if (index === -1) return;

        setMessagesList((prevMessages) => [
          ...prevMessages.slice(0, index),
          { ...prevMessages[index], message: EditValue },
          ...prevMessages.slice(index + 1),
        ]);

        socket.emit("one-to-one-edited", {
          messageId: EditId,
          updatedMessage: EditValue,
        });

        setEditId("");
        setEditValue("");
      }
    }
  };

  const downloadRecording = async (filePath) => {
    try {
      const response = await axios.get(`${appServer}/recording/${filePath}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filePath;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const deleteRecording = async (filename) => {
    await axios.post(`${appServer}/recording/delete/`, { filename: filename });

    const deleteMessage = MessagesList.find(
      (message) => message.type === "recording" && message.filePath === filename
    );

    if (deleteMessage) {
      setMessagesList((prev) => [
        ...prev.filter((message) => message._id !== deleteMessage._id),
      ]);
      ws.emit("recording-delete", { filename });
    }
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
      setRemoteStream(event.streams[0]);
      console.log(event.track);
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
      const localStream = new MediaStream();

      const audioStream = await getMediaStream(constraints.audio, "audio");
      const videoStream = await getMediaStream(constraints.video, "video");

      if (audioStream instanceof MediaStream) {
        audioStream.getTracks().forEach((track) => {
          localStream.addTrack(track);
          peerConnection.addTrack(track);
        });
        setMicEnable(true);
      } else {
        setMicEnable(false);
      }

      if (videoStream instanceof MediaStream) {
        videoStream.getTracks().forEach((track) => {
          localStream.addTrack(track);
          peerConnection.addTrack(track);
        });
        setCameraEnable(true);
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

        localStream.addTrack(blackVideoTrack);
        peerConnection.addTrack(blackVideoTrack);
        setCameraEnable(false);
      }

      setLocalStream(localStream);

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
      }
    };

    startCall();
  }, [LocalStream, callId, peerConnection, userId, userImage, userName, ws]);

  useEffect(() => {
    if (LocalStream && localVideoRef.current) {
      localVideoRef.current.srcObject = LocalStream;
    }
  }, [LocalStream]);

  useEffect(() => {
    if (RemoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = RemoteStream;
    }
  }, [RemoteStream]);

  // useEffect(() => {
  //   let canvasRecorder;
  //   let audioRecorder;

  //   let videoChunks = [];

  //   const loadRecorder = async () => {
  //     if (!LocalStream || !RemoteStream) return;

  //     const canvas = RecorderCanvas || document.createElement("canvas");
  //     !RecorderCanvas && setRecorderCanvas(canvas);
  //     const ctx = canvas.getContext("2d");
  //     if (!ctx) return;

  //     const CombinedContext = audioContext || new AudioContext();
  //     !audioContext && setAudioContext(CombinedContext);

  //     const localAudio = LocalStream.getAudioTracks().length;
  //     const remoteAudio = RemoteStream.getAudioTracks().length;

  //     if (localAudio > 0 && remoteAudio > 0) {
  //       const localSource =
  //         CombinedContext.createMediaStreamSource(LocalStream);
  //       const remoteSource =
  //         CombinedContext.createMediaStreamSource(RemoteStream);

  //       const localGain = CombinedContext.createGain();
  //       const remoteGain = CombinedContext.createGain();

  //       localGain.gain.setValueAtTime(1, CombinedContext.currentTime);
  //       remoteGain.gain.setValueAtTime(1, CombinedContext.currentTime);

  //       localSource.connect(localGain);
  //       remoteSource.connect(remoteGain);

  //       const destination = CombinedContext.createMediaStreamDestination();

  //       localGain.connect(destination);
  //       remoteGain.connect(destination);

  //       audioRecorder = AudioRecorder || new MediaRecorder(destination.stream);
  //       !AudioRecorder && setAudioRecorder(audioRecorder);

  //       if ((!MicEnable && RecorderAudio) || (MicEnable && !RecorderAudio)) {
  //         let RecordingStopped = false;

  //         if (audioRecorder.state === "recording") {
  //           audioRecorder.stop();
  //           RecordingStopped = true;
  //         }

  //         audioRecorder.stream
  //           .getAudioTracks()
  //           .map((track) => audioRecorder?.stream.removeTrack(track));
  //         destination.stream
  //           .getAudioTracks()
  //           .map((track) => audioRecorder?.stream.addTrack(track));
  //         setRecorderAudio(!RecorderAudio);
  //         RecordingStopped && audioRecorder.start();
  //       }
  //     }

  //     canvasRecorder =
  //       mediaRecorder || new MediaRecorder(canvas.captureStream(30));
  //     !mediaRecorder && setMediaRecorder(canvasRecorder);

  //     const localStream = new MediaStream();
  //     LocalStream.getVideoTracks().map((track) => localStream.addTrack(track));
  //     const localVideo = document.createElement("video");
  //     localVideo.srcObject = localStream;
  //     localVideo.autoplay = true;

  //     const remoteStream = new MediaStream();
  //     RemoteStream.getVideoTracks().map((track) =>
  //       remoteStream.addTrack(track)
  //     );
  //     const remoteVideo = document.createElement("video");
  //     remoteVideo.srcObject = remoteStream;
  //     remoteVideo.autoplay = true;

  //     const drawFrame = () => {
  //       canvas.width =
  //         (localVideo.videoWidth || 0) + (remoteVideo.videoWidth || 0) + 100;
  //       canvas.height =
  //         Math.max(localVideo.videoHeight || 0, remoteVideo.videoHeight || 0) +
  //         100;

  //       ctx.clearRect(0, 0, canvas.width, canvas.height);

  //       ctx.drawImage(
  //         localVideo,
  //         50,
  //         50,
  //         canvas.width / 2 - 50,
  //         canvas.height - 100
  //       );
  //       ctx.drawImage(
  //         remoteVideo,
  //         canvas.width / 2,
  //         50,
  //         canvas.width / 2 - 50,
  //         canvas.height - 100
  //       );

  //       ctx.fillStyle = "white";
  //       ctx.font = "20px Arial";
  //       ctx.textAlign = "center";
  //       ctx.fillText(userName, canvas.width / 2 - 100, canvas.height - 50);
  //       ctx.fillText(CurrentChat.name, canvas.width - 150, canvas.height - 50);

  //       requestAnimationFrame(drawFrame);
  //     };

  //     try {
  //       if (!IsRecording && audioRecorder) {
  //         audioRecorder.ondataavailable = (ev) => {
  //           setAudioChunks((prev) => [...prev, ev.data]);
  //         };

  //         canvasRecorder.ondataavailable = (ev) => {
  //           videoChunks.push(ev.data);
  //         };

  //         canvasRecorder.onstop = async () => {
  //           const videoBlob = new Blob(videoChunks, {
  //             type: "video/webm",
  //           });
  //           videoChunks = [];

  //           setRecordedVideo(videoBlob);
  //         };

  //         canvasRecorder.onerror = (e) => {
  //           console.error("Error during recording:", e);
  //         };
  //       }

  //       if (IsCallRecording && !RecordedBy && !IsRecording && audioRecorder) {
  //         drawFrame();

  //         audioRecorder.start();
  //         canvasRecorder.start();

  //         setIsRecording(true);
  //         setRecordedBy(userId);
  //         ws.emit("recording", {
  //           call_id: callId,
  //           recording: true,
  //           userId: userId,
  //         });
  //       }

  //       if (
  //         RecordedBy === userId &&
  //         !IsCallRecording &&
  //         IsRecording &&
  //         audioRecorder &&
  //         audioRecorder.state === "recording" &&
  //         canvasRecorder.state === "recording"
  //       ) {
  //         audioRecorder.stop();
  //         canvasRecorder.stop();
  //         setIsRecording(false);
  //         setRecordedBy(null);
  //         ws.emit("recording", {
  //           call_id: callId,
  //           recording: false,
  //           userId: userId,
  //         });
  //       }

  //       if (RecordedVideo) {
  //         const currentDate = new Date();
  //         const formattedDate = currentDate
  //           .toISOString()
  //           .replace(/:/g, "-")
  //           .split(".")[0]
  //           .replace("T", "_");
  //         const videoFile = `video-wiredtalk-call-recording_${callId}_${formattedDate}.mp4`;
  //         const audioFile = `audio-wiredtalk-call-recording_${callId}_${formattedDate}.mp3`;

  //         const audioBlobs = await Promise.all(
  //           AudioChunks.map(
  //             (chunk) => new Blob([chunk], { type: "audio/webm" })
  //           )
  //         );

  //         const formData = new FormData();
  //         formData.append("videoFile", RecordedVideo, videoFile);
  //         audioBlobs.map((audioBlob, index) =>
  //           formData.append(
  //             "audioFile-" + index,
  //             audioBlob,
  //             index + "-" + audioFile
  //           )
  //         );
  //         formData.append("senderId", userId);
  //         formData.append("receiverId", CurrentChat._id);
  //         formData.append(
  //           "timming",
  //           currentDate.toLocaleTimeString([], {
  //             hour12: true,
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           })
  //         );

  //         setRecordedVideo(null);

  //         await axios
  //           .post(`${appServer}/uploads/`, formData, {
  //             headers: {
  //               "Content-Type": "multipart/form-data",
  //             },
  //           })
  //           .then((res) => {
  //             setUpdatesMessage(res.data.message);
  //             setTimeout(() => setUpdatesMessage(null), 5000);

  //             let addedRecording = false;
  //             const newMessage = {
  //               _id: res.data.recordingId,
  //               senderId: userId,
  //               receiverId: CurrentChat._id,
  //               filePath: videoFile.replace("video-", ""),
  //               timming: currentDate.toLocaleTimeString([], {
  //                 hour12: true,
  //                 hour: "2-digit",
  //                 minute: "2-digit",
  //               }),
  //               seen: true,
  //               type: "recording",
  //             };

  //             setMessagesList((prevMessages) => {
  //               const recordingExist = prevMessages.some(
  //                 (message) => message._id === newMessage._id
  //               );

  //               if (!recordingExist && !addedRecording) {
  //                 addedRecording = true;
  //                 return [...prevMessages, newMessage];
  //               }

  //               return prevMessages;
  //             });

  //             ws.emit("recording-save", newMessage);
  //           })
  //           .catch((err) => console.log(err));
  //       }

  //       return;
  //     } catch (error) {
  //       return console.error("Error loading functions:", error);
  //     }
  //   };

  //   loadRecorder();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   callId,
  //   MicEnable,
  //   LocalStream,
  //   RemoteStream,
  //   audioContext,
  //   setAudioContext,
  //   RecorderCanvas,
  //   setRecorderCanvas,
  //   IsCallRecording,
  //   setIsCallRecording,
  //   IsRecording,
  //   setIsRecording,
  //   mediaRecorder,
  //   setMediaRecorder,
  //   AudioRecorder,
  //   setAudioRecorder,
  //   RecorderAudio,
  //   setRecorderAudio,
  //   RecordedVideo,
  //   setRecordedVideo,
  //   AudioChunks,
  //   setAudioChunks,
  // ]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (CurrentChat?._id) {
          const result = await axios.get(
            `${appServer}/api/v1/messages/one-to-one/${userId}`
          );

          const messages = result.data;
          setMessagesList(
            messages.filter(
              (message) =>
                (message.senderId === userId &&
                  message.receiverId === CurrentChat._id) ||
                (message.senderId === CurrentChat._id &&
                  message.receiverId === userId)
            )
          );
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getMessages();
  }, [CurrentChat?._id, userId, ws]);

  useEffect(() => {
    const messageToEdit = MessagesList.find((msg) => msg._id === EditId);
    if (messageToEdit && messageToEdit.message) {
      setEditValue(messageToEdit.message);
    } else {
      setEditValue("");
    }
  }, [EditId, MessagesList]);

  useEffect(() => {
    const messageStatusHandle = async ({ messageId }) => {
      setMessagesList((prev) => {
        const message = prev.find((msg) => msg._id === messageId);
        if (message) {
          return prev.map((msg) =>
            msg._id === messageId ? { ...msg, seen: true } : msg
          );
        }
        return prev;
      });
    };

    const OneToOneDelete = ({ messageId }) => {
      setMessagesList((prev) =>
        prev.filter((message) => message._id !== messageId)
      );
    };

    const OneToOneMessage = async ({
      _id,
      senderId,
      receiverId,
      message,
      timming,
      seen,
    }) => {
      if (senderId === userId || receiverId === userId) {
        if (receiverId === userId) {
          axios.get(
            `${appServer}/api/v1/message/one-to-one/change-status/${_id}`
          );
        }
        setMessagesList((prev) => [
          ...prev,
          {
            _id,
            senderId,
            receiverId,
            message,
            timming,
            seen,
            type: "message",
          },
        ]);
      }
    };

    const OneToOneEdited = ({ messageId, updatedMessage }) => {
      setMessagesList((prev) => {
        const index = prev.findIndex((message) => message._id === messageId);
        if (index === -1) return prev;

        const updatedMessages = [...prev];
        updatedMessages[index] = {
          ...updatedMessages[index],
          message: updatedMessage,
        };
        return updatedMessages;
      });
    };

    const recordingSaveHandle = ({
      _id,
      senderId,
      receiverId,
      filePath,
      timming,
      seen,
    }) => {
      if (senderId === userId || receiverId === userId) {
        if (receiverId === userId) {
          axios.get(
            `${appServer}/api/v1/message/one-to-one/change-status/${_id}`
          );
        }
        setMessagesList((prev) => [
          ...prev,
          {
            _id,
            senderId,
            receiverId,
            filePath,
            timming,
            seen,
            type: "recording",
          },
        ]);
      }
    };

    const recordingDeleteHandle = ({ filename }) => {
      const deleteMessage = MessagesList.find(
        (message) =>
          message.type === "recording" && message.filePath === filename
      );

      if (deleteMessage) {
        setMessagesList((prev) => [
          ...prev.filter((message) => message._id !== deleteMessage._id),
        ]);
      }
    };

    const recordingHandle = ({ call_id, recording, userId }) => {
      if (call_id === callId && userId === CurrentChat?._id) {
        setIsCallRecording(recording);
        setRecordedBy(recording ? CurrentChat?._id : null);
      }
    };

    ws.on("recording", recordingHandle);
    ws.on("message-read", messageStatusHandle);
    ws.on("one-to-one-delete", OneToOneDelete);
    ws.on("one-to-one-edited", OneToOneEdited);
    ws.on("one-to-one-message", OneToOneMessage);
    ws.on("recording-save", recordingSaveHandle);
    ws.on("recording-delete", recordingDeleteHandle);
    return () => {
      ws.off("recording", recordingHandle);
      ws.off("message-read", messageStatusHandle);
      ws.off("one-to-one-delete", OneToOneDelete);
      ws.off("one-to-one-edited", OneToOneEdited);
      ws.off("one-to-one-message", OneToOneMessage);
      ws.off("recording-save", recordingSaveHandle);
      ws.off("recording-delete", recordingDeleteHandle);
    };
  }, [CurrentChat?._id, MessagesList, callId, userId, ws]);

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
      {IsCallRecording && (
        <div
          className="position-fixed top-0 left-0 right-0 px-3 py-2 bg-primary text-white font-weight-bold"
          style={{ zIndex: 20 }}
        >
          Call is recording by{" "}
          {RecordedBy && RecordedBy === userId ? userName : CurrentChat.name}.
        </div>
      )}
      {/* {UpdatesMessage && (
        <div
          className="position-fixed top-3 left-0 right-0 text-center"
          style={{ zIndex: 20 }}
        >
          <p className="px-3 py-2 bg-primary font-weight-bold rounded">
            {UpdatesMessage}
          </p>
        </div>
      )} */}
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
          playsInline
          autoPlay
        ></video>
      </div>
      <div
        className="text-light position-fixed h-100 d-flex justify-content-center align-items-center"
        style={{ top: 0, bottom: 0, left: ToggleChat, zIndex: 20 }}
      >
        <div
          className="bg-light text-dark"
          style={{ width: "22vw", height: "100%" }}
        >
          <div className="chatbox-body w-100" style={{ height: "90%" }}>
            {MessagesList.map((Message) => {
              const isSender = Message.senderId === userId ? false : true;

              return Message.type === "message" ? (
                <MessageBox
                  CurrentChat={CurrentChat}
                  key={Message._id}
                  Message={Message}
                  userId={userId}
                  onEdit={() => setEditId(Message._id)}
                  onDelete={() => {
                    deleteMessage(Message._id);
                  }}
                />
              ) : (
                Message.type === "recording" && (
                  <div
                    key={Message._id}
                    className={`d-flex align-items-center ${
                      isSender ? "justify-content-start" : "justify-content-end"
                    } px-3`}
                  >
                    <div
                      className="position-relative my-2 rounded px-2 pt-2 bg-white"
                      style={{ maxWidth: "250px" }}
                    >
                      <p className="bg-light text-dark rounded p-2 text-ellipsis overflow-hidden whitespace-nowrap">
                        {Message.filePath}
                      </p>
                      <div className="d-flex justify-content-start align-items-center pt-1">
                        <button
                          className="bg-info text-light px-3 py-2 ml-0 mr-2 rounded"
                          onClick={() =>
                            Message.filePath &&
                            downloadRecording(Message.filePath)
                          }
                        >
                          Download
                        </button>
                        {Message.senderId === userId && (
                          <button
                            className="bg-info text-light px-3 py-2 rounded"
                            onClick={() =>
                              Message.filePath &&
                              deleteRecording(Message.filePath)
                            }
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
          <div
            className="chatbox-footer d-flex justify-content-center align-items-center w-100 py-3"
            style={{ height: "10%" }}
          >
            <input
              type="text"
              placeholder="Type here..."
              value={Message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2"
              style={{ width: "80% !important" }}
            />
            <button onClick={sendMessage}>
              <Send fontSize="inherit" />
            </button>
          </div>
        </div>
        <div className="position-relative h-100 w-auto d-flex justify-content-center align-items-center">
          <button
            className="bg-primary py-3 rounded-r m-0"
            onClick={() => setToggleChat(ToggleChat === "0" ? "-22%" : "0")}
          >
            {ToggleChat === "0" ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
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
          className="bg-success text-light rounded-full p-3 mx-4"
          onClick={() => setIsCallRecording(!IsCallRecording)}
          disabled={RecordedBy && RecordedBy !== userId}
        >
          <RadioButtonChecked />
        </button>
        <button
          className="bg-danger text-light rounded-full p-3 mx-4"
          onClick={endCall}
        >
          <CallEnd />
        </button>
      </div>

      {EditId !== "" && (
        <div className="position-fixed d-flex justify-content-center align-items-center message-edit">
          <div className="bg-white px-3 py-2 rounded">
            <input
              type="text"
              value={EditValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="my-2 border border-primary rounded"
            />
            <div className="d-flex align-items-center justify-content-around">
              <button
                className="bg-primary text-white px-2 py-1 rounded"
                onClick={CencelEditedMessage}
              >
                Cencel
              </button>
              <button
                className="bg-primary text-white px-2 py-1 rounded"
                onClick={sendEditMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VC;
