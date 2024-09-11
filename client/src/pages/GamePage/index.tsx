import {MutableRefObject, useContext, useEffect, useRef} from 'react';
import styles from "./style.module.sass"
import io, {Socket} from "socket.io-client";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import Square from "components/Square";
import {ThemeContext} from "src/App.tsx";
import {GameStateEnum} from "utils/types.ts";
import {emptySquares, SERVER_URL} from "consts/consts.ts";

export default function GamePage() {

	const {gameState, setGameState} = useContext(ThemeContext);

	const navigate = useNavigate()

	const socketRef:MutableRefObject<Socket | null> = useRef(null)

	useEffect(() => {

		if (gameState.game_state == GameStateEnum.NotStarted) {
			navigate("/")
		}

		const myUrlWithParams = new URL(SERVER_URL);
		myUrlWithParams.searchParams.append("username", gameState.username);
		socketRef.current = io(myUrlWithParams.href)

		socketRef.current?.on("game_start", (data) => {
			setGameState((oldState) => ({
				...oldState,
				squares: emptySquares,
				opponent: data.players.find(player => player.username != gameState.username).username,
				game_state: data.goes.username == oldState.username ? GameStateEnum.WaitingForMove : GameStateEnum.WaitingForOtherPlayerMove,
				item: data.goes.username == oldState.username ? "X" : "O",
				goes: data.goes.username,
				winner: null
			}))
		})

		socketRef.current?.on("update_board", (data) => {
			setGameState((oldState) => {
				let newGameState
				if (data.game_state == GameStateEnum.Ended || data.game_state == GameStateEnum.Draw) {
					newGameState = data.game_state
				} else {
					newGameState = data.goes.username == oldState.username ? GameStateEnum.WaitingForMove : GameStateEnum.WaitingForOtherPlayerMove
				}

				return {
					...oldState,
					squares: data.squares,
					game_state: newGameState,
					winner: data.winner,
					goes: data.goes.username
				}
			})
		})

		return () => {
			socketRef.current?.disconnect()
		}
	}, []);

    function restartGame() {
		socketRef.current?.emit("restart", {
			goes: gameState.username
		} as never)
    }

	function handleClick(i) {
		if (gameState.game_state === GameStateEnum.WaitingForOtherPlayerMove || gameState.game_state === GameStateEnum.Ended || gameState.game_state === GameStateEnum.Draw || gameState.squares[i]) {
			return;
		}

		const nextSquares = [...gameState.squares];

		nextSquares[i] = gameState.item

		socketRef.current?.emit("move", {
			nextSquares: nextSquares
		} as never)
	}

	if (gameState.game_state == GameStateEnum.WaitingForOtherPlayerConnection)
	{
		return (
			<div className={styles.root}>
				<span>Ожидание второго игрока</span>
			</div>
		)
	}

	let status;
	if (gameState.game_state == GameStateEnum.Ended) {
		status = 'Победитель: ' + gameState.winner;
	} else if (gameState.game_state === GameStateEnum.Draw) {
		status = "Ничья";
	} else {
		status = gameState.game_state == GameStateEnum.WaitingForMove ? "Ваш ход" : 'Ход соперника';
	}

	const isBlocked = gameState.game_state === GameStateEnum.WaitingForOtherPlayerMove ||
		gameState.game_state === GameStateEnum.Ended || gameState.game_state === GameStateEnum.Draw

	const items = Array.from(Array(9).keys()).map(i => <Square value={gameState.squares[i]} isBlocked={isBlocked} onSquareClick={() => handleClick(i)} key={i} />)

	const isEnded = gameState.game_state == GameStateEnum.Ended || gameState.game_state === GameStateEnum.Draw


	return (
		<div className={styles.root}>
			<div>Вы: {gameState.username}</div>
			<div>Вы играете за <b>{gameState.item == "X" ? "Крестики" : "Нолики"}</b></div>
			<div>Ваш соперник: {gameState.opponent}</div>
			<div>{status}</div>
			<div className={styles.board}>
				{items}
			</div>
			{isEnded && <Button variant="contained" onClick={restartGame}>Начать заново</Button>}
		</div>
    );
}