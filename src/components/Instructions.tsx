import { useEventListener } from "@/hooks/useEventListener";
import { useState } from "react";

export const Instructions = () => {
	const [keyType, setKeyType] = useState<"vim" | "arrow" | "wasd">("arrow");

	const keyMap = {
		vim: {
			up: "k",
			right: "l",
			down: "j",
			left: "h",
		},
		arrow: {
			up: "Up",
			right: "Right",
			down: "Down",
			left: "Left",
		},
		wasd: {
			up: "w",
			right: "d",
			down: "s",
			left: "a",
		},
	};

	useEventListener("keydown", (e) => {
		switch (e.key) {
			case "ArrowUp":
			case "ArrowDown":
			case "ArrowLeft":
			case "ArrowRight":
				setKeyType("arrow");
				break;
			case "W":
			case "A":
			case "S":
			case "D":
			case "w":
			case "a":
			case "s":
			case "d":
				setKeyType("wasd");
				break;
			case "K":
			case "J":
			case "H":
			case "L":
			case "k":
			case "j":
			case "h":
			case "l":
				setKeyType("vim");
				break;
		}
	});

	return (
		<div className="bg-slate-900 bg-opacity-75 text-white absolute bottom-5 left-5 rounded-lg p-5">
			<div className="text-xl text-center">Instructions</div>
			<div className="text-center">Maybe</div>
			<div className="text-center">|</div>
			<div className="text-center">{keyMap[keyType].up}</div>
			<div className="flex gap-2">
				<div>Bad - {keyMap[keyType].left}</div>
				<div className="w-16" />
				<div>{keyMap[keyType].right} - Good</div>
			</div>
		</div>
	);
};
