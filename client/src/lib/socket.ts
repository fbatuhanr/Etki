import { io } from "socket.io-client";

const socket = io(process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3001", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
