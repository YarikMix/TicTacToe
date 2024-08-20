import {MutableRefObject, useEffect, useRef} from "react";
import io, {Socket} from 'socket.io-client'

const SERVER_PORT = 3001
const SERVER_URL = 'http://localhost:' + SERVER_PORT

function App() {

	const socketRef:MutableRefObject<Socket | null> = useRef(null)

	useEffect(() => {
		socketRef.current = io(SERVER_URL)
		console.log("AAAAAAA")
		setTimeout(() => socketRef.current?.emit("message", {data: "hello"}), 1000)
	}, []);

	return (
		<>

		</>
	)
}

export default App
