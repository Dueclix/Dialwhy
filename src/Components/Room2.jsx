import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "./LoginSignup";
import io from "socket.io-client";
import axios from "axios";

const AskToJoin = () => {
  const socket = io("http://localhost:4000");
  const [user, setUser] = useState("");

  const { roomId } = useParams();

  useEffect(() => {
    let loggedinUser = localStorage.getItem("user");
    if (loggedinUser) {
      let parsedUser = JSON.parse(loggedinUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (roomId) {
      socket.emit("joinRoom", roomId);
    }

    socket.on("notification", (data) => {
      console.log("Notification received:", data);
    });

    return () => {
      socket.off("notification");
    };
  }, [roomId]);

  const handleJoinPermission = async () => {
    console.log("Ask to Join the Room");
    try {
      // Assuming you have a backend endpoint to send notifications
      const response = await axios.post(`${server}/user/request-permission`, {
        roomId,
        message: `${user.name} requests permission to join the room.`,
        userId: user._id,
      });
      if (response.data.success) {
        console.log("Notification sent to admin");
      } else {
        console.error("Failed to send notification.");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-red-300">
      <div className="self-center">
        <button
          onClick={handleJoinPermission}
          className="bg-black text-white rounded-lg p-4"
        >
          Ask to Join the Room
        </button>
      </div>
    </div>
  );
};

export default AskToJoin;
