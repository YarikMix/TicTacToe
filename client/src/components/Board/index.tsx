import styles from "./styles.module.sass"
import {Button} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "store/store.ts";
import {GameStateEnum} from "store/gameSlice.ts";
import clsx from "clsx";

function calculateWinner(squares) {
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
			return squares[a];
		}
	}
	return null;
}

function Square({ value, onSquareClick }) {
	return (
		<button className={styles.cell} onClick={onSquareClick}>
			{value}
		</button>
	);
}

interface Props {
	xIsNext: boolean
	squares: Array<string | null>
	onPlay: (squares:Array<string | null>) => void
	jumpTo: (nextMove:number) => void
}

export default function Board({ xIsNext, squares, onPlay, jumpTo }: Props) {

	const {username, game_state, opponent, item} = useSelector((state:RootState) => state.game)

	function handleClick(i) {
		if (game_state === GameStateEnum.WaitingForOtherPlayerMove) {
			// TODO: уведомление о том, что сейчас ходит соперник
			return;
		}

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		const nextSquares = squares.slice();

		if (xIsNext) {
			nextSquares[i] = 'X';
		} else {
			nextSquares[i] = 'O';
		}

		onPlay(nextSquares);
	}

	const winner = calculateWinner(squares);

	let status;
	if (winner) {
		status = 'Победитель: ' + winner;
	} else {
		status = game_state == GameStateEnum.WaitingForMove ? "Ваш ход" : 'Ход соперника';
	}

	const restartGame = () => jumpTo(0)

	const items = Array.from(Array(squares.length).keys()).map(i => <Square value={squares[i]} onSquareClick={() => handleClick(i)} />)

	return (
		<>
			<div className="status">Вы: {username}</div>
			<div className="status">Вы играете за: {item}</div>
			<div className="status">Ваш соперник: {opponent}</div>
			<div className="status">{status}</div>
			<div className={clsx(styles.board, game_state === GameStateEnum.WaitingForOtherPlayerMove || game_state === GameStateEnum.Ended && styles.blocked)}>
				{items}
			</div>
			{winner && <Button variant="contained" onClick={restartGame}>Начать заново</Button>}
		</>
	);
}