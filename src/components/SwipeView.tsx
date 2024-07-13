import { invoke } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
	isRegistered,
	registerAll,
	unregisterAll,
} from "@tauri-apps/api/globalShortcut";

export const SwipeView = () => {
	const [photos, setPhotos] = useState<string[] | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const getPhotos = async () => {
		setPhotos(null);
		try {
			const res = await invoke("get_photos");

			const paths = (res as string[]).map((path) => {
				return convertFileSrc(path);
			});

			setPhotos(paths);
		} catch (e) {
			toast("There was an error while loading the photos.");
			console.error(e);
		}
	};

	const swipeRight = () => {
		console.log("Right");
		setCurrentIndex((prev) =>
			prev < (photos?.length ?? 0) - 1 ? prev + 1 : prev,
		);
	};
	const swipeLeft = () => {
		console.log("Left");
		setCurrentIndex((prev) =>
			prev < (photos?.length ?? 0) - 1 ? prev + 1 : prev,
		);
	};
	const swipeUp = () => {
		console.log("Up");
	};

	const undo = () => {
		console.log("Undo");
	};

	useEffect(() => {
		getPhotos();
		registerAll(["ArrowRight", "D", "L"], swipeRight).catch(console.error);
		registerAll(["ArrowLeft", "A", "H"], swipeLeft).catch(console.error);
		registerAll(["ArrowUp", "W", "K"], swipeUp).catch(console.error);
		registerAll(["CommandOrControl+Z", "Backspace"], undo).catch(console.error);

		return () => {
			unregisterAll();
		};
	}, []);

	if (photos == null) return <div>Loading...</div>;
	if (photos.length === 0) return <div>No photos found</div>;

	console.log(photos);

	return (
		<div className="w-full p-4">
			<div className="mx-auto text-center mb-2">
				<Button onClick={swipeUp}>Maybe</Button>
			</div>
			<div className="flex items-center gap-2 w-full">
				<Button onClick={swipeLeft}>Bad</Button>
				<img
					className="grow max-h-[80vh] max-w-[90vw] object-contain"
					src={photos[currentIndex]}
					alt="Current photo w-full"
				/>
				<Button onClick={swipeRight}>Good</Button>
			</div>
			<div className="text-center mt-2">
				<Button onClick={() => setCurrentIndex(0)}>Refresh photos</Button>
			</div>
		</div>
	);
};
