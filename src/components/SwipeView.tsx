import { invoke } from "@tauri-apps/api";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAppView } from "../contexts/AppView";
import { Button } from "./ui/button";

type Photo = { path: string; name: string };

export const SwipeView = () => {
	const [photos, setPhotos] = useState<Photo[] | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const { setView } = useAppView();

	const getPhotos = useCallback(async () => {
		setPhotos(null);
		try {
			const res = await invoke("get_photos");

			const paths = (res as { path: string; name: string }[]).map((photo) => {
				return { ...photo, path: convertFileSrc(photo.path) };
			});

			setPhotos(paths);
		} catch (e) {
			toast("There was an error while loading the photos.");
			console.error(e);
		}
	}, []);

	const goToNextPhoto = useCallback(() => {
		setCurrentIndex((prev) => {
			if (photos == null) return prev;
			if (prev + 1 >= photos?.length) {
				setView("confirmation");
				return prev;
			}

			return prev + 1;
		});
	}, [photos, setView]);

	const swipeRight = useCallback(async () => {
		if (photos == null) return;
		try {
			await invoke("move_to", {
				dirType: "good",
				index: currentIndex,
			});
			goToNextPhoto();
		} catch (e) {
			toast("There was an error while moving the photo to the good directory.");
			console.error(e);
		}
	}, [currentIndex, photos, goToNextPhoto]);

	const swipeLeft = useCallback(async () => {
		if (photos == null) return;
		try {
			await invoke("move_to", {
				dirType: "bad",
				index: currentIndex,
			});
			goToNextPhoto();
		} catch (e) {
			toast("There was an error while moving the photo to the bad directory.");
			console.error(e);
		}
	}, [currentIndex, photos, goToNextPhoto]);

	const swipeUp = useCallback(async () => {
		if (photos == null) return;
		try {
			await invoke("move_to", {
				dirType: "maybe",
				currentPath: photos[currentIndex].path,
			});
			goToNextPhoto();
		} catch (e) {
			toast(
				"There was an error while moving the photo to the maybe directory.",
			);
			console.error(e);
		}
	}, [currentIndex, photos, goToNextPhoto]);

	// const undo = useCallback(async () => {
	//   console.log("Undo");
	// }, []);

	// const handleKeyDown = useCallback(
	//   (e: { key: string }) => {
	//     switch (e.key) {
	//       case "ArrowRight":
	//       case "D":
	//       case "L":
	//         return swipeRight();
	//       case "ArrowLeft":
	//       case "A":
	//       case "H":
	//         return swipeLeft();
	//       case "ArrowUp":
	//       case "W":
	//       case "K":
	//         return swipeUp();
	//       case "CommandOrControl+Z":
	//       case "Backspace":
	//         return undo();
	//     }
	//   },
	//   [swipeLeft, swipeRight, swipeUp, undo],
	// );

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		getPhotos();
		containerRef.current?.focus();

		// appWindow.listen("keydown", handleKeyDown);
	}, [getPhotos]);

	if (photos == null) return <div>Loading...</div>;
	if (photos.length === 0) return <div>No photos found</div>;

	return (
		<div className="w-full p-4" ref={containerRef}>
			<div className="mx-auto text-center mb-2">
				<Button onClick={swipeUp}>Maybe</Button>
			</div>
			<div className="flex items-center gap-2 w-full">
				<Button onClick={swipeLeft}>Bad</Button>
				<img
					className="grow max-h-[80vh] max-w-[90vw] object-contain"
					src={photos[currentIndex].path}
					alt={photos[currentIndex].name}
				/>
				<Button onClick={swipeRight}>Good</Button>
			</div>
			<div className="text-center mt-2">
				<Button onClick={() => setCurrentIndex(0)}>Refresh photos</Button>
			</div>
		</div>
	);
};
