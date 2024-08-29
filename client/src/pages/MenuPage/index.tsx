import {Button, TextField, Typography} from "@mui/material";
import {FormEvent, useContext, useState} from "react";
import s from "./style.module.sass"
import {useNavigate} from "react-router-dom";
import {ThemeContext} from "src/App.tsx";
import {GameStateEnum} from "utils/types.ts";

function MenuPage() {

	const navigate = useNavigate()

	const {setGameState} = useContext(ThemeContext);

	const [value, setValue] =  useState('')

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()

		if (value) {
			setGameState((oldGameState) => ({
				...oldGameState,
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