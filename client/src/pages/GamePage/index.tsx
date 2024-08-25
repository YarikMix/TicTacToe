import {MutableRefObject, useEffect, useRef} from 'react';
import styles from "./style.module.sass"
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "store/store.ts";
import {GameStateEnum, updateGameState} from "store/gameSlice.ts";
import io, {Socket} from "socket.io-client";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import Square from "components/Square";

const SERVER_PORT = 3001
const SERVER_URL = 'http://localhost:' + SERVER_PORT

export default function GamePage() {

	const {username, game_state, item, squares, winner, opponent} = useSelector((state:RootState) => state.game)

	const dispatch = useDispatch()

	const navigate = useNavigate()

	const socketRef:MutableRefObject<Socket | null> = useRef(null)

	useEffect(() => {

		if (game_state == GameStateEnum.NotStarted) {
			navigate("/")
		}

		const myUrlWithParams = new URL(SERVER_URL);
		myUrlWithParams.searchParams.append("username", username);
		socketRef.current = io(myUrlWithParams.href)

		socketRef.current?.on("game_start", (data) => {
			dispatch(updateGameState({
				squares: Array(9).fill(null),
				opponent: data.players.find(player => player.username != username).username,
				game_state: data.goes.username == username ? GameStateEnum.WaitingForMove : GameStateEnum.WaitingForOtherPlayerMove,
				item: data.goes.username == username ? "X" : "O",
				goes: data.goes.username,
				winner: null
			}))
		})

		socketRef.current?.on("update_board", (data) => {
			let newGameState
			if (data.game_state == GameStateEnum.Ended || data.game_state == GameStateEnum.Draw) {
				newGameState = data.game_state
			} else {
				newGameState = data.goes.username == username ? GameStateEnum.WaitingForMove : GameStateEnum.WaitingForOtherPlayerMove
			}

			dispatch(updateGameState({
				squares: data.squares,
				game_state: newGameState,
				winner: data.winner,
				goes: data.goes.username
			}))
		})

		return () => {
			socketRef.current?.disconnect()
		}

	}, []);

    function restartGame() {
		socketRef.current?.emit("restart", {
			goes: username
		} as never)
    }

	function handleClick(i) {
		if (game_state === GameStateEnum.WaitingForOtherPlayerMove || game_state === GameStateEnum.Ended || game_state === GameStateEnum.Draw || squares[i]) {
			return;
		}

		const nextSquares = [...squares];

		nextSquares[i] = item

		socketRef.current?.emit("move", {
			nextSquares: nextSquares
		} as never)
	}

	if (game_state == GameStateEnum.WaitingForOtherPlayerConnection)
	{
		return (
			<div className={styles.root}>
				<span>Ожидание второго игрока</span>
			</div>
		)
	}

	let status;
	if (game_state == GameStateEnum.Ended) {
		status = 'Победитель: ' + winner;
	} else if (game_state === GameStateEnum.Draw) {
		status = "Ничья";
	} else {
		status = game_state == GameStateEnum.WaitingForMove ? "Ваш ход" : 'Ход соперника';
	}

	const isBlocked = game_state === GameStateEnum.WaitingForOtherPlayerMove ||
		game_state === GameStateEnum.Ended || game_state === GameStateEnum.Draw

	const items = Array.from(Array(squares.length).keys()).map(i => <Square value={squares[i]} isBlocked={isBlocked} onSquareClick={() => handleClick(i)} />)

	const isEnded = game_state == GameStateEnum.Ended || game_state === GameStateEnum.Draw

	return (
		<div className={styles.root}>
			<div>Вы: {username}</div>
			<div>Вы играете за <b>{item == "X" ? "Крестики" : "Нолики"}</b></div>
			<div>Ваш соперник: {opponent}</div>
			<div>{status}</div>
			<div className={styles.board}>
				{items}
			</div>
			{isEnded && <Button variant="contained" onClick={restartGame}>Начать заново</Button>}
		</div>
    );
}