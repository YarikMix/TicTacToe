import Index from "pages/GamePage";
import "./index.sass"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuPage from "pages/MenuPage";
import React, {createContext, useState} from "react";
import {GameStateEnum} from "utils/types.ts";
import {emptySquares} from "consts/consts.ts";

interface ThemeContextValue {
	gameState: GameState;
	setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface GameState {
	goes?: string | null
	squares?: Array<string | undefined>
	opponent?: string | null
	username?: string | null
	item?: "X" | "O" | null
	winner?: string | null
	game_state?: GameStateEnum
}

const initialState:GameState = {
	goes: null,
	squares: emptySquares,
	opponent: null,
	username: null,
	item: null,
	winner: null,
	game_state: GameStateEnum.NotStarted
}

function App() {

	const [gameState, setGameState] = useState<GameState>(initialState);

	const value = { gameState, setGameState }

	return (
		<ThemeContext.Provider value={value} >
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MenuPage />} />
					<Route path="/game" element={<Index />} />
				</Routes>
			</BrowserRouter>
		</ThemeContext.Provider>
	)
}

export default App
