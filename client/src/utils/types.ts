export enum GameStateEnum {
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
	goes?: string | null
	squares?: Array<string | undefined>
	opponent?: string | null
	username?: string | null
	item?: "X" | "O" | null
	winner?: string | null
	game_state?: GameStateEnum
}
