const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let leaderboard = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (username) => {
    console.log(`${username} joined`);
  });

  socket.on("finished", (data) => {
    leaderboard.push(data);
    leaderboard.sort((a, b) => a.time - b.time);
    io.emit("updateLeaderboard", leaderboard);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
