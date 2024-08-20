import {Socket} from "socket.io";

const express = require("express");
const app = express()
const http = require("http");
const {} = require("socket.io")
const {Server} = require("socket.io")
const cors = require("cors")

app.use(cors())
const server = http.createServer()

const io = new Server(server, {
	cors: {
		origin: "*"
	}
})

io.on("connection", (socket:Socket) => {
	console.log("User Connected")

	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
	});

	socket.on("message", async (message:string) => {
		console.log("New message", message);
	});
})


server.listen(3001, () => {
	console.log("SERVER IS RUNNING")
})