import Index from "pages/GamePage";
import "./index.sass"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MenuPage from "pages/MenuPage";
import {Provider} from "react-redux";
import store from "src/store";

function App() {

	return (
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MenuPage />} />
					<Route path="/game" element={<Index />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	)
}

export default App
