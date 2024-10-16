import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { appServer } from "../../utils";
import socket from "../../utils/socket";
import axios from "axios";
import { CallEnd } from "@mui/icons-material";

function VC() {
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [peerConnection, setPeerConnection] = useState(null);
  const [LocalStream, setLocalStream] = useState(null);
  const [CallStatus, setCallStatus] = useState("");
  const remoteVideoRef = useRef();
  const localVideoRef = useRef();
  const { callId } = useParams();
  const ws = socket;

  ws.connect();

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
        // CallAudio && CallAudio.pause();
        setTimeout(() => setCallStatus(""), 2000);
      }
    };

    const handleCallDeclined = (data) => {
      if (data.callId === callId && data.from === userId) {
        setCallStatus("Call Declined.");
        // CallAudio && CallAudio.pause();
        window.location.replace("/");
        // window.location.replace(prevRoute ? prevRoute : "/");
      }
    };

    const handleReceiverBusy = async (data) => {
      if (data.callId === callId && data.from === userId) {
        setCallStatus(`User is busy.`);
        // CallAudio && CallAudio.pause();
        setTimeout(() => {
          window.location.replace("/");
          //   window.location.replace(prevRoute ? prevRoute : "/");
        }, 3000);
      }
    };

    // const ChangeEvent = (data) => {
    //   if (callId === data.call_id && CurrentChat._id === data.senderId) {
    //     if (data.type === "audio") {
    //       setRemoteAudio(!data.state);
    //     } else if (data.type === "video") {
    //       setRemoteVideo(!data.state);
    //     }
    //   }
    // };

    ws.on("calling", handleCalling);
    ws.on("ringing", handleRinging);
    // ws.on("change-event", ChangeEvent);
    ws.on("declined", handleCallDeclined);
    ws.on("accepting", handleCallAccepted);
    ws.on("receiver-busy", handleReceiverBusy);

    return () => {
      ws.off("calling", handleCalling);
      ws.off("ringing", handleRinging);
      //   ws.off("change-event", ChangeEvent);
      ws.off("declined", handleCallDeclined);
      ws.off("accepting", handleCallAccepted);
      ws.off("receiver-busy", handleReceiverBusy);
    };
  }, [userId, callId, ws]);

  useEffect(() => {
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

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
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
          style={{ zIndex: 2, bottom: "5%", right: "5%", transform: "rotateY(180deg)" }}
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
          className="bg-danger text-light rounded-full p-3"
          onClick={() => endCall()}
        >
          <CallEnd />
        </button>
      </div>
    </div>
  );
}

export default VC;
