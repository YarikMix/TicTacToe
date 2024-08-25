import styles from "./styles.module.sass"
import clsx from "clsx";

export default function Square({ value, isBlocked, onSquareClick }) {
	return (
		<button className={clsx(styles.cell, isBlocked && styles.blocked)} onClick={onSquareClick}>
			{value}
		</button>
	);
}