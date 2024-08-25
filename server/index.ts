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

const  enum GameStateEnum {
	NotStarted,
	WaitingForOtherPlayerConnection,
	Ended
}

interface Player {
	id: string,
	username: string
}

interface GameState {
	currentMove: number
	history: Array<Array<string | null>>
	players: Player[]
	goes: Player | null
	winner: string | null
	game_state: GameStateEnum
}

const gameState:GameState = {
	currentMove: 0,
	history: [Array(9).fill(null)],
	players: [],
	winner: null,
	goes: null,
	game_state: GameStateEnum.NotStarted
}

function randomElement<T>(array:T[]):T {
	return array[Math.floor(Math.random() * array.length)]
}

io.on("connection", (socket:Socket) => {
	console.log("User Connected")
	console.log(socket.id)
	console.log(socket.handshake.query.username)

	gameState.players.push({
		id: socket.id,
		username: socket.handshake.query.username as string
	})

	gameState.goes = randomElement(gameState.players)

	console.log(gameState)

	if (gameState.players.length > 1) {
		console.log("Game has been started")
		io.sockets.emit('game_start', {
			currentMove: gameState.currentMove,
			history: gameState.history,
			players: gameState.players,
			goes: gameState.goes
		});
	}

	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
	});

	socket.on("move", async (data) => {
		console.log("move");
		console.log("username", gameState.players.find(player => player.id == socket.id));
		console.log("data", data);
		console.log("nextHistory", data.nextHistory);

		gameState.goes = gameState.players.find(player => player.id != socket.id) as Player;
		gameState.history = data.nextHistory
		gameState.currentMove = data.nextHistory.length - 1

		io.sockets.emit('update_board', {
			goes: gameState.goes,
			history: gameState.history,
			currentMove: gameState.currentMove
		});

	});
})


server.listen(3001, () => {
	console.log("SERVER IS RUNNING")
})