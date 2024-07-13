import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

export type ViewT = "folders" | "swipe";

export const AppView = createContext<{
	view: ViewT;
	setView: Dispatch<SetStateAction<ViewT>>;
} | null>(null);

export const useAppView = () => {
	const view = useContext(AppView);

	if (view === null)
		throw new Error("useAppView must be used within AppView.Provider");

	return view;
};
