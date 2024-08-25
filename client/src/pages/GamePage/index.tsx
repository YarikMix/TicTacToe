import {MutableRefObject, useEffect, useRef, useState} from 'react';
import styles from "./style.module.sass"
import Board from "components/Board";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "store/store.ts";
import {GameStateEnum, updateGameState} from "store/gameSlice.ts";
import io, {Socket} from "socket.io-client";

const SERVER_PORT = 3001
const SERVER_URL = 'http://localhost:' + SERVER_PORT

export default function GamePage() {

	const {username, game_state, history, currentMove} = useSelector((state:RootState) => state.game)

	const dispatch = useDispatch()

	const xIsNext = currentMove % 2 === 0;

    const [currentSquares, setCurrentSquares] = useState<Array<string | null>>(history[currentMove]);

	const socketRef:MutableRefObject<Socket | null> = useRef(null)

	useEffect(() => {

		const myUrlWithParams = new URL(SERVER_URL);
		myUrlWithParams.searchParams.append("username", username);
		socketRef.current = io(myUrlWithParams.href)

		// socketRef.current?.emit("connect", {data: username})

		socketRef.current?.on("game_start", (data) => {
			dispatch(updateGameState({
				history: data.history,
				opponent: data.players.find(player => player.username != username).username,
				game_state: data.goes.username == username ? GameStateEnum.WaitingForMove : GameStateEnum.WaitingForOtherPlayerMove,
				item: data.goes.username == username ? "X" : "O"
			}))
		})

		socketRef.current?.on("update_board", (data) => {
			console.log("update_board")
			console.log("data", data)

			dispatch(updateGameState({
				currentMove: data.currentMove,
				history: data.history,
				game_state: data.goes.username == username ? GameStateEnum.WaitingForMove : GameStateEnum.WaitingForOtherPlayerMove
			}))

			setCurrentSquares(data.history[data.currentMove])
		})

	}, []);

	function handlePlay(nextSquares:Array<string | null>) {
		console.log("handlePlay")
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		console.log("nextHistory", nextHistory)
		socketRef.current?.emit("move", {
			nextHistory: nextHistory
		})
    }

    function jumpTo(nextMove:number) {
		console.log(nextMove)
        // TODO: setCurrentMove(nextMove);
    }

	console.log("render")
	console.log("currentSquares", currentSquares)

    return (
        <div className={styles.root}>
			{game_state == GameStateEnum.WaitingForOtherPlayerConnection ?
				<span>Ожидание второго игрока</span> :
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} jumpTo={jumpTo} />
			}
		</div>
    );
}