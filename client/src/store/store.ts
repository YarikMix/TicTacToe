import {configureStore} from "@reduxjs/toolkit";

import gameReducer from "./gameSlice.ts"

export const store = configureStore({
	reducer: {
		game: gameReducer
	}
});

export type RootState = ReturnType<typeof store.getState>