import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_LOCAL_URL || "http://localhost:3001", {
    withCredentials: true,
    autoConnect: true,
});

export default socket;