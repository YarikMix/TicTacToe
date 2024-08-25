import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export interface GameState {
	goes?: string | null
	squares?: Array<string | null>
	opponent?: string | null
	username?: string | null
	item?: "X" | "O" | null
	winner?: string | null
	game_state?: GameStateEnum
}

export const enum GameStateEnum {
	NotStarted,
	WaitingForOtherPlayerConnection,
	WaitingForOtherPlayerMove,
	WaitingForMove,
	Ended,
	Draw
}

const initialState:GameState = {
	goes: null,
	squares: Array(9).fill(null),
	opponent: null,
	username: null,
	item: null,
	winner: null,
	game_state: GameStateEnum.NotStarted
}

const gameSlice = createSlice({
	name: 'game',
	initialState: initialState,
	reducers: {
		updateGameState: (state, action:PayloadAction<GameState>) => {
			console.log("updateGameState")
			console.log(action.payload)

			if (action.payload.username) {
				state.username = action.payload.username
			}

			state.winner = action.payload.winner

			if (action.payload.item) {
				state.item = action.payload.item
			}

			if (action.payload.game_state) {
				state.game_state = action.payload.game_state
			}

			if (action.payload.opponent) {
				state.opponent = action.payload.opponent
			}

			if (action.payload.squares) {
				state.squares = action.payload.squares
			}

			if (action.payload.goes) {
				state.goes = action.payload.goes
			}
		}
	}
})

export const { updateGameState } = gameSlice.actions

export default gameSlice.reducer