import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.API_SOCKET_URL || "http://localhost:8000", {
  withCredentials: false,
});

export default socket;
