import { useState } from "react";
import "./App.css";
import { FoldersForm } from "./components/FoldersForm";
import { AppView, ViewT } from "./contexts/AppView";
import { SwipeView } from "./components/SwipeView";

function App() {
	const [view, setView] = useState<ViewT>("folders");
	return (
		<AppView.Provider value={{ view, setView }}>
			<div className="flex flex-col items-center justify-center h-screen">
				{view === "folders" ? <FoldersForm /> : null}
				{view === "swipe" ? <SwipeView /> : null}
			</div>
		</AppView.Provider>
	);
}

export default App;
