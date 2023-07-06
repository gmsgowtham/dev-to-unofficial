import { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
	Latest: undefined;
	Home: undefined;
	Videos: undefined;
};

export type DrawerParamList = {
	TabNav: NavigatorScreenParams<TabParamList>;
};

export type StackParamList = {
	Landing: NavigatorScreenParams<DrawerParamList>;
	Article: {
		id: number;
		title: string;
		url: string;
	};
	Bookmarks: undefined;
	Video: {
		id: number;
		title: string;
		url: string;
		source: string;
		cover: string;
	};
	About: undefined;
	Settings: undefined;
	TermsAndConditions: undefined;
};
