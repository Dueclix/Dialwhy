import { io } from "socket.io-client";

const uri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://dvcall.com/";

const socket = io(uri, {
  autoConnect: false,
  reconnection: true,
  transports: ["websocket"],
});

export default socket;
