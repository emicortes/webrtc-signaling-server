import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { Universe } from "./universe.js";
import cors from "cors";
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const universe = new Universe(io);

app.use(cors);

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
