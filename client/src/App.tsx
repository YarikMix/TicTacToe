import {MutableRefObject, useEffect, useRef} from "react";
import io, {Socket} from 'socket.io-client'
import Game from "./Game";
import "./index.css"

const SERVER_PORT = 3001
const SERVER_URL = 'http://localhost:' + SERVER_PORT

function App() {

	const socketRef:MutableRefObject<Socket | null> = useRef(null)

	useEffect(() => {
		socketRef.current = io(SERVER_URL)
		socketRef.current?.emit("message", {data: "hello"})
	}, []);

	return (
		<Game />
	)
}

export default App
