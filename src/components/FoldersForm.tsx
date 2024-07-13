import { useAppView } from "@/contexts/AppView";
import { dialog, invoke } from "@tauri-apps/api";
import { pictureDir } from "@tauri-apps/api/path";
import { appWindow } from "@tauri-apps/api/window";
import { type Dispatch, type SetStateAction, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

const FolderButton = ({
	folder,
	setFolder,
	name,
}: {
	folder: string | string[] | null;
	setFolder: Dispatch<SetStateAction<string | string[] | null>>;
	name: string;
}) => {
	return (
		<div className="flex items-center gap-2 mx-auto">
			<Button
				type="button"
				variant={folder != null ? "destructive" : "outline"}
				onClick={async () => {
					const res = await dialog.open({
						title: `Select ${name[0].toUpperCase() + name.slice(1)} Folder`,
						directory: true,
						recursive: true,
						defaultPath: await pictureDir(),
					});

					setFolder(res);
				}}
			>
				{folder != null ? `Change ${name} folder` : `Select ${name} folder`}
			</Button>
			{folder}
		</div>
	);
};

export const FoldersForm = () => {
	const [good, setGood] = useState<string | string[] | null>(null);
	const [bad, setBad] = useState<string | string[] | null>(null);
	const [maybe, setMaybe] = useState<string | string[] | null>(null);
	const [photos, setPhotos] = useState<string | string[] | null>(null);

	const { setView } = useAppView();

	const handleContinue = async () => {
		try {
			await invoke("initialize", {
				photosDir: photos,
				goodDir: good,
				badDir: bad,
				maybeDir: maybe,
			});

			setView("swipe");

			appWindow.setFullscreen(true);
		} catch (error) {
			toast("There was an error while initializing the folders.");
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold text-center">Select Folders</h1>
				<FolderButton folder={photos} setFolder={setPhotos} name="photos" />
				<FolderButton folder={good} setFolder={setGood} name="good" />
				<FolderButton folder={bad} setFolder={setBad} name="bad" />
				<FolderButton folder={maybe} setFolder={setMaybe} name="maybe" />
				{photos != null && (
					<Button type="button" onClick={handleContinue}>
						Continue
					</Button>
				)}
			</div>
		</div>
	);
};
