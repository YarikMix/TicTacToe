export const enum GameStateEnum {
	NotStarted,
	WaitingForOtherPlayerConnection,
	WaitingForOtherPlayerMove,
	WaitingForMove,
	Ended,
	Draw
}

export interface Player {
	id: string,
	username: string,
	item?: "X" | "O" | null
}

export interface GameState {
	goes: Player | null
	squares: Array<string | undefined>
	players: Player[]
	winner: string | null
	game_state: GameStateEnum
}
