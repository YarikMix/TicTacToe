import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export interface GameState {
	currentMove?: number
	history?: Array<Array<string | null>>
	opponent?: string | null
	username?: string | null
	item?: "X" | "O" | null
	room_id?: string | null
	winner?: string | null
	game_state?: GameStateEnum
}

export const enum GameStateEnum {
	NotStarted,
	WaitingForOtherPlayerConnection,
	WaitingForOtherPlayerMove,
	WaitingForMove,
	Ended
}

const initialState:GameState = {
	currentMove: 0,
	history: [Array(9).fill(null)],
	opponent: null,
	username: null,
	item: null,
	room_id: null,
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

			if (action.payload.room_id) {
				state.room_id = action.payload.room_id
			}

			if (action.payload.winner) {
				state.winner = action.payload.winner
			}

			if (action.payload.item) {
				state.item = action.payload.item
			}

			if (action.payload.game_state) {
				state.game_state = action.payload.game_state
			}

			if (action.payload.opponent) {
				state.opponent = action.payload.opponent
			}

			if (action.payload.history) {
				state.history = action.payload.history
			}

			if (action.payload.currentMove) {
				state.currentMove = action.payload.currentMove
			}
		}
	}
})

export const { updateGameState } = gameSlice.actions

export default gameSlice.reducer