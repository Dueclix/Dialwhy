import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Partials/Navbar/Navbar";
import Footer from "./Partials/Footer";
import { server } from "./LoginSignup";
import toast from "react-hot-toast";
import axios from "axios";

const Room = () => {
  const [user, setUser] = useState("");
  const [showJoinMessage, setShowJoinMessage] = useState(false);

  useEffect(() => {
    let loggedinUser = localStorage.getItem("user");
    if (loggedinUser !== undefined) {
      let parsedUser = JSON.parse(loggedinUser);
      setUser(parsedUser);
    }
  }, []); // Added roomId to the dependencies array

  const { roomId } = useParams();
  const [apiKeys, setApiKeys] = useState([]);
  const [appID, setAppID] = useState("");
  const [serverSecretString, setServerSecretString] = useState("");

  const getAPIKeys = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/user/zego-api`);
      setApiKeys(data.zegoAPIKeys[0]);
      let appId = Number(data.zegoAPIKeys[0].appID);
      setAppID(appId);
      setServerSecretString(data.zegoAPIKeys[0].serverSecret);
      console.log(appID, serverSecretString);
    } catch (error) {
      console.log(error);
      toast.success(error.message);
    }
  };
  useEffect(() => {
    getAPIKeys();
  }, []);
  const elementRef = useRef(null); // Creating a ref
  const [loading, setLoading] = useState(false);
  //   useEffect(() => {
  // if (elementRef.current) {
  const myMeeting = async (element) => {
    // const appId = 1888647465;
    // const serverSecret = "44df9635abde6364df1bec2513f569f3";
    const appId = appID;
    const serverSecret = serverSecretString;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      Date.now().toString(),
      user ? user.name : "Please Login to Continue"
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp?.joinRoom({
      container: element,
      screenSharingConfig: {
        height: "100vh",
        width: "100vw",
      },

      sharedLinks: [
        {
          name: "Share the Link with whomever you want to talk",
          url: `https://dialwhy.com/room/${roomId}`,
          // url: `http://localhost:5173/room/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      preJoinViewConfig: {
        title: "Enter Your Name to Continue the Meeting",
      },
      title: "Continue",

      // branding: {
      //   logoURL: "https://dialwhy.com/logo/vite.jpg",
      // },
      showPreJoinView: true,
      showLayoutButton: true,
      showAudioVideoSettingsButton: true,
      showRemoveUserButton: true,
      onJoinRoom: handleJoinRoom,
    });
    console.log(zp);
  };

  const navigate = useNavigate();
  const checkRoomExist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/user/check-room/${roomId}`);
      toast.success(data.message);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error);
      navigate("/login");
      window.location.reload();
    }
  };

  useEffect(() => {
    checkRoomExist();
  }, []);

  const handleJoinRoom = () => {
    setShowJoinMessage(true);
    let loggedinUser = localStorage.getItem("user");
    if (loggedinUser !== undefined) {
      let parsedUser = JSON.parse(loggedinUser);
      setUser(parsedUser);
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <Navbar />
      {showJoinMessage && (
        <div className="flex items-center justify-center gap-2 bg-black ">
          {" "}
          <img
            src="/room-logo.jpg"
            alt="room logo"
            className="rounded-lg mb-2"
            width={30}
          />
          <p className="text-white absolute text-xl font-semibold pt-4 pb-3 right-1 bg-black text-center">
            Say hello to continue the meeting or leave your name and number and
            we will contact you shortly.
          </p>
        </div>
      )}
      <div ref={myMeeting} style={{ width: "100vw", height: "70vh" }}></div>

      <Footer />
    </>
  );
};

export default Room;
