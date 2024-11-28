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

    // ctx.save();
    // ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // ctx.drawImage(
    //   results.segmentationMask,
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );

    // ctx.globalCompositeOperation = "source-out";
    // ctx.fillStyle = "#00FF00";
    // ctx.drawImage(
    //   backgroundImage,
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );

    // ctx.globalCompositeOperation = "destination-atop";

    // ctx.drawImage(
    //   results.image,
    //   0,
    //   0,
    //   canvasRef.current.width,
    //   canvasRef.current.height
    // );
    // ctx.restore();
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

function VC() {
  const userImage =
    JSON.parse(localStorage.getItem("user"))?.image.url || "/Profile.png";
  const userName = JSON.parse(localStorage.getItem("user")).name;
  const [IsCallRecording, setIsCallRecording] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))._id;
  const [peerConnection, setPeerConnection] = useState(null);
  const [RecorderCanvas, setRecorderCanvas] = useState(null);
  const [LocalStream, setLocalStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const virtualBackgroundImage = "/background.jpeg";

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
        }

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

    if(videoRef.current || canvasRef.current) {
      initVideoStream();
    }
  }, [videoRef.current, canvasRef.current]);

  useEffect(()=>{
    console.log(LocalStream);
  },[LocalStream])

  return (
    <div className="video-conference-container">
      <video ref={videoRef} className="video-feed d-none" autoPlay playsInline />
      <canvas ref={canvasRef} className="virtual-background-canvas" />
    </div>
  );
}

export default VC;
