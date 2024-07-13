import { useState } from "react";
import "./App.css";
import { exit } from "@tauri-apps/api/process";
import { FoldersForm } from "./components/FoldersForm";
import { SwipeView } from "./components/SwipeView";
import { Button } from "./components/ui/button";
import { AppView, type ViewT } from "./contexts/AppView";

function App() {
	const [view, setView] = useState<ViewT>("folders");
	return (
		<AppView.Provider value={{ view, setView }}>
			<div className="flex flex-col items-center justify-center h-screen">
				{view === "folders" ? <FoldersForm /> : null}
				{view === "swipe" ? <SwipeView /> : null}
				{view === "confirmation" ? (
					<div>
						<p className="text-center text-4xl mb-2 select-none">Done!</p>
						<Button onClick={() => setView("folders")} className="mr-1">
							Sort more photos
						</Button>
						or
						<Button
							onClick={() => exit(0)}
							variant={"destructive"}
							className="ml-1"
						>
							Exit
						</Button>
					</div>
				) : null}
			</div>
		</AppView.Provider>
	);
}

export default App;
