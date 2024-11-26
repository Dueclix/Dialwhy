// import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
// import { Camera } from "@mediapipe/camera_utils/camera_utils.js";
// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import socket from "../../utils/socket";

// function VC() {
//   const userImage =
//     JSON.parse(localStorage.getItem("user"))?.image.url || "/Profile.png";
//   const userName = JSON.parse(localStorage.getItem("user")).name;
//   const [IsCallRecording, setIsCallRecording] = useState(false);
//   const [backgroundImage, setBackgroundImage] = useState(null);
//   const userId = JSON.parse(localStorage.getItem("user"))._id;
//   const [LocalStream, setLocalStream] = useState(null);
//   const [MicToggle, setMicToggle] = useState(true);
//   const [CamToggle, setCamToggle] = useState(true);
//   const LocalVideoRef = useRef();
//   const LocalAudioRef = useRef();
//   const { callId } = useParams();
//   const canvasRef = useRef();
//   const ws = socket;
//   let ctx = null;

//   ws.connect();

//   const getConstraints = async () => {
//     const devices = await navigator.mediaDevices.enumerateDevices();
//     const constraints = {
//       video: {
//         deviceId: devices.filter((device) => device.kind === "videolocal")[0]
//           ?.deviceId,
//         width: { min: 640, ideal: 1920, max: 1920 },
//         height: { min: 400, ideal: 1080 },
//       },
//       audio: {
//         deviceId: devices.filter((device) => device.kind === "audiolocal")[0]
//           ?.deviceId,
//         echoCancellation: true,
//         noiseSuppression: true,
//         sampleRate: 44100,
//       },
//     };

//     if (!constraints.audio) {
//       alert("Error: Not get any audio source.");
//       // window.location.replace(prevRoute ? prevRoute : "/");
//       window.location.replace("/");
//     } else if (!constraints.video) {
//       alert("Error: Not get any video source.");
//     }

//     return constraints;
//   };

//   const getMediaStream = async (constraint, type) => {
//     let constraints = {};

//     if (type === "video") {
//       constraints = { video: constraint };
//     } else if (type === "audio") {
//       constraints = { audio: constraint };
//     }

//     try {
//       const newStream = await navigator.mediaDevices.getUserMedia(constraints);
//       return newStream;
//     } catch (err) {
//       return Error("an Error Occurred");
//     }
//   };

//   const init = async () => {
//     const selfieSegmentation = new SelfieSegmentation({
//       locateFile: (file) =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
//     });

//     const constraints = await getConstraints();

//     ctx = canvasRef.current.getContext("2d");

//     const localStream = new MediaStream();

//     const videoStream = await getMediaStream(constraints.video, "video");
//     const audioStream = await getMediaStream(constraints.video, "audio");

//     if (audioStream instanceof MediaStream) {
//       audioStream.getTracks().map((track) => localStream.addTrack(track));
//       setMicToggle(true);
//     } else {
//       setMicToggle(false);
//     }

//     if (videoStream instanceof MediaStream) {
//       videoStream.getTracks().map((track) => localStream.addTrack(track));
//       setCamToggle(true);
//     } else {
//       const videoCanvas = document.createElement("canvas");
//       videoCanvas.width = 1920;
//       videoCanvas.height = 1080;
//       const ctx = videoCanvas.getContext("2d");
//       if (ctx) {
//         ctx.fillStyle = "black";
//         ctx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
//       }

//       const blackStream = videoCanvas.captureStream();
//       const blackVideoTrack = blackStream.getVideoTracks()[0];

//       localStream.addTrack(blackVideoTrack);
//       setCamToggle(false);
//     }

//     const localAudio = new Audio();
//     localAudio.srcObject = localStream;
//     localAudio.play();

//     LocalVideoRef.current.srcObject = localStream;
//     LocalAudioRef.current = localAudio;

//     selfieSegmentation.setOptions({
//       modelSelection: 1,
//       selfieMode: true,
//     });

//     selfieSegmentation.onResults(onResults);

//     const camera = new Camera(LocalVideoRef.current, {
//       onFrame: async () => {
//         await selfieSegmentation.send({ image: LocalVideoRef.current });
//       },
//       width: 1280,
//       height: 720,
//     });
//     camera.start();
//   };

//   useEffect(() => {
//     const img = new Image();
//     img.src = "/background.jpeg";
//     img.onload = () => setBackgroundImage(img);

//     if (LocalVideoRef.current) {
//       init();
//     }
//   }, [LocalVideoRef.current]);

//   const onResults = (results) => {
//     if (
//       !results.segmentationMask ||
//       !results.image ||
//       !backgroundImage ||
//       !ctx
//     )
//       return;

//     ctx.save();
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     ctx.drawImage(
//       results.segmentationMask,
//       0,
//       0,
//       canvasRef.current.width,
//       canvasRef.current.height
//     );

//     ctx.globalCompositeOperation = "source-out";
//     ctx.fillStyle = "#00FF00";
//     ctx.drawImage(
//       backgroundImage,
//       0,
//       0,
//       canvasRef.current.width,
//       canvasRef.current.height
//     );

//     ctx.globalCompositeOperation = "destination-atop";

//     ctx.drawImage(
//       results.image,
//       0,
//       0,
//       canvasRef.current.width,
//       canvasRef.current.height
//     );
//     ctx.restore();
//   };

//   return (
//     <div>
//       <video
//         autoPlay
//         playsInline
//         muted
//         className="d-none"
//         ref={LocalVideoRef}
//         width={1280}
//         height={720}
//       />
//       <canvas
//         ref={canvasRef}
//         width={1280}
//         height={720}
//         style={{ transform: "rotateY(180deg)" }}
//       />
//     </div>
//   );
// }

// export default VC;

import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { Camera } from "@mediapipe/camera_utils/camera_utils.js";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../../utils/socket";
import { appServer } from "../../utils";
import axios from "axios";

function VC() {
  const [isCallRecording, setIsCallRecording] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [PeerConnection, setPeerConnection] = useState(null);
  const { name: userName, image = {}, _id: userId } = user;
  const [RemoteStream, setRemoteStream] = useState(null);
  const [MainStream, setMainStream] = useState(null);
  const [CurrentChat, setCurrentChat] = useState();
  const [micToggle, setMicToggle] = useState(true);
  const [camToggle, setCamToggle] = useState(true);
  const [CallAudio, setCallAudio] = useState(null);
  const userImage = image.url || "/Profile.png";
  const remoteVideoRef = useRef(null);
  const LocalStreamRef = useRef(null);
  const LocalVideoRef = useRef(null);
  const LocalAudioRef = useRef(null);
  const canvasRef = useRef(null);
  const { callId } = useParams();
  const ws = socket;

  ws.connect();

  const getConstraints = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const constraints = {
      video: {
        deviceId: devices.filter((device) => device.kind === "videolocal")[0]
          ?.deviceId,
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 400, ideal: 1080 },
      },
      audio: {
        deviceId: devices.filter((device) => device.kind === "audiolocal")[0]
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

  const init = async () => {
    const selfieSegmentation = await new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    selfieSegmentation.setOptions({
      modelSelection: 1,
      selfieMode: true,
    });

    const constraints = await getConstraints();

    const localStream = new MediaStream();
    const mainStream = new MediaStream();
    const videoStream = await getMediaStream(constraints.video, "video");
    const audioStream = await getMediaStream(constraints.audio, "audio");

    if (videoStream) {
      videoStream.getTracks().forEach((track) => localStream.addTrack(track));
      setCamToggle(true);
    } else {
      setCamToggle(false);
    }

    if (audioStream) {
      localStream.addTrack(audioStream.getAudioTracks()[0]);
      mainStream.addTrack(audioStream.getAudioTracks()[0]);
      setMicToggle(true);
    } else {
      setMicToggle(false);
    }

    LocalStreamRef.current = localStream;

    const localAudio = new Audio();
    localAudio.srcObject = localStream;
    localAudio.play();

    LocalVideoRef.current.srcObject = localStream;
    LocalStreamRef.current = localStream;
    LocalAudioRef.current = localAudio;

    const ctx = canvasRef.current.getContext("2d");

    const canvasStream = canvasRef.current.captureStream();
    mainStream.addTrack(canvasStream.getVideoTracks()[0]);

    setMainStream(mainStream);

    selfieSegmentation.onResults((results) => {
      if (
        !results.segmentationMask ||
        !results.image ||
        !backgroundImage ||
        !ctx
      )
        return;

      ctx.save();
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.drawImage(
        results.segmentationMask,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      ctx.globalCompositeOperation = "source-out";
      ctx.fillStyle = "#00FF00";
      ctx.drawImage(
        backgroundImage,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      ctx.globalCompositeOperation = "destination-atop";

      ctx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      ctx.restore();
    });

    const camera = new Camera(LocalVideoRef.current, {
      onFrame: async () => {
        await selfieSegmentation.send({ image: LocalVideoRef.current });
      },
      width: 1280,
      height: 720,
    });

    camera.start();
  };

  useEffect(() => {
    const handleIncomingOffer = async (data) => {
      const { offer, from, to } = data;
      if (to !== userId || !PeerConnection) return;

      try {
        await PeerConnection.setRemoteDescription(offer);
        const answer = await PeerConnection.createAnswer();
        await PeerConnection.setLocalDescription(answer);
        ws.emit("answer", { answer, from: userId, to: from });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const handleIncomingAnswer = async (data) => {
      // eslint-disable-next-line no-unused-vars
      const { answer, from, to } = data;
      if (to !== userId || !PeerConnection) return;

      try {
        await PeerConnection.setRemoteDescription(answer);
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    };

    const handleIncomingIceCandidate = async (candidate) => {
      if (!PeerConnection) return;

      try {
        await PeerConnection.addIceCandidate(candidate);
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
  }, [PeerConnection, userId, ws]);

  useEffect(() => {
    const img = new Image();
    img.src = "/background.jpeg";
    img.onload = () => setBackgroundImage(img);

    if (LocalVideoRef.current) {
      init();
    }
  }, [LocalVideoRef.current]);

  useEffect(() => {
    if (!MainStream) return;

    const remoteStream = new MediaStream();
    setRemoteStream(remoteStream);

    const initializePeerConnection = async () => {
      const pc = new RTCPeerConnection();
      setPeerConnection(pc);

      pc.addEventListener("icecandidate", (ev) => {
        if (ev.candidate) ws.emit("ice-candidate", ev.candidate);
      });

      pc.addEventListener("track", (ev) => {
        remoteStream.addTrack(ev.track);
      });

      // pc.addEventListener("iceconnectionstatechange", async () => {
      //   if (
      //     pc.iceConnectionState === "closed" ||
      //     pc.iceConnectionState === "disconnected" ||
      //     pc.iceConnectionState === "failed"
      //   ) {
      //     endCall();
      //   }
      // });
    };

    initializePeerConnection();
  }, [MainStream, ws]);

  useEffect(() => {
    if (!PeerConnection) return;

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

      MainStream.getTracks().map((track) =>
        PeerConnection.addTrack(track, MainStream)
      );

      try {
        const offer = await PeerConnection.createOffer();
        await PeerConnection.setLocalDescription(offer);
        if (callData.receivers === userId) {
          ws.emit("offer", {
            offer,
            from: userId,
            to: callData.creatorId,
            type: callData.type,
          });
        }
      } catch (err) {
        console.log(err, PeerConnection);
      };
    };

    startCall();
  }, [MainStream, PeerConnection, callId, userId, ws]);

  useEffect(() => {
    if (!RemoteStream) return;

    remoteVideoRef.current.srcObject = RemoteStream;
  }, [RemoteStream]);

  return (
    <div>
      <video
        ref={LocalVideoRef}
        className="d-none"
        height={720}
        width={1280}
        playsInline
        autoPlay
        muted
      />
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        style={{ transform: "rotateY(180deg)" }}
      />
      <video
        ref={remoteVideoRef}
        className="w-auto h-auto"
        playsInline
        autoPlay
      />
    </div>
  );
}

export default VC;
