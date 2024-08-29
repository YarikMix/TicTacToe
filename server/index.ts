import {Socket, Server} from "socket.io";
import http from "http"
import cors from "cors"
import {GameState, GameStateEnum, Player} from "./types";

const express = require("express");
const app = express()

app.use(cors())

const server = http.createServer()

const io = new Server(server, {
	cors: {
		origin: "*"
	}
})

const gameState:GameState = {
	squares: Array(9).fill(null),
	players: [],
	winner: null,
	goes: null,
	game_state: GameStateEnum.NotStarted
}

function randomElement<T>(array:T[]):T {
	return array[Math.floor(Math.random() * array.length)]
}

function count<T>(array:T[],item:T):number{
	return array.filter(x => x == item).length
}

function calculateWinner(squares:Array<string | null>) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return gameState.players.find(player => player.item == squares[a])?.username;
		}
	}

	return null;
}

io.on("connection", (socket:Socket) => {
	gameState.players.push({
		id: socket.id,
		username: socket.handshake.query.username as string
	})

	if (gameState.players.length > 1) {
		gameState.goes = randomElement(gameState.players);
		(gameState.players.find(player => player.id == gameState.goes?.id) as Player).item = "X";
		(gameState.players.find(player => player.id != gameState.goes?.id) as Player).item = "O";

		io.sockets.emit('game_start', {
			squares: gameState.squares,
			players: gameState.players,
			goes: gameState.goes
		});
	}

	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
	});

	socket.on("move", async (data) => {
		gameState.goes = gameState.players.find(player => player.id != socket.id) as Player;
		gameState.squares = data.nextSquares

		const winner = calculateWinner(data.nextSquares);
		if (winner) {
			gameState.winner = winner
			gameState.game_state = GameStateEnum.Ended
		} else if (!winner && !count(data.nextSquares, null)) {
			gameState.game_state = GameStateEnum.Draw
		}

		io.sockets.emit('update_board', {
			goes: gameState.goes,
			squares: gameState.squares,
			game_state: gameState.game_state,
			winner: gameState.winner
		});
	});

	socket.on("restart", async () => {
		gameState.goes = gameState.players.find(player => player.id == socket.id) as Player;
		gameState.winner = null
		gameState.game_state = GameStateEnum.NotStarted

		io.sockets.emit('game_start', {
			goes: gameState.goes,
			squares: Array.from({length: 9}),
			players: gameState.players
		});
	})
})


server.listen(3001, () => {
	console.log("SERVER IS RUNNING")
})