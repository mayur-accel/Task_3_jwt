import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "../config/config";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connection successfull");
  console.log("User id:", socket.id);

  socket.on("send-message", (message) => {
    console.log(message);
    io.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("Use is disconnect", socket.id);
  });
});

// disconnect socket code start here
const closeAllConnections = () => {
  for (const [id, socket] of io.sockets.sockets) {
    console.log(`Disconnecting socket ${id}`);
    socket.disconnect(true); // true ensures the socket is forcefully disconnected
  }
};
// Example usage: Close all connections after 10 seconds
setTimeout(() => {
  console.log("Closing all connections...");
  closeAllConnections();
}, 10000);
// disconnect socket code end here

server.listen(config.get("serverPort"), () => {
  console.log("Server start on port", config.get("serverPort"));
});
