import {Button, TextField, Typography} from "@mui/material";
import {FormEvent, useState} from "react";
import s from "./style.module.sass"
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {GameStateEnum, updateGameState} from "store/gameSlice.ts";

function MenuPage() {

	const navigate = useNavigate()

	const dispatch = useDispatch()

	const [value, setValue] =  useState('')

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (value) {
			dispatch(updateGameState({
				username: value,
				game_state: GameStateEnum.WaitingForOtherPlayerConnection
			}))

			navigate("/game")
		}
	}

	return (
		<div className={s.root}>
			<Typography variant="h4">Онлайн крестики нолики</Typography>
			<TextField id="outlined-basic" label="Введите имя" variant="outlined" value={value} onChange={(e) => setValue(e.target.value)} error={false}/>
			<Button variant="contained" type="submit" onClick={handleSubmit}>Присоединиться к игре</Button>
		</div>
	)
}

export default MenuPage