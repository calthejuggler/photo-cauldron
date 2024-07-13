import { useState } from "react";
import "./App.css";
import { FoldersForm } from "./components/FoldersForm";
import { SwipeView } from "./components/SwipeView";
import { AppView, type ViewT } from "./contexts/AppView";

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
