import { getArticlesList } from "../../api";
import { ApiArticleFeedItem, ArticleFeedApiStates } from "../../api/types";
import { perfArrayConcat } from "../../utils/array";
import { DEFAULT_PAGE_SIZE, HELP_TEXT } from "../../utils/const";
import {
	CommonState,
	setErrorState,
	setFetchingState,
	setRefreshingState,
} from "../helpers";
import { ToastAndroid } from "react-native";
import { create } from "zustand";

export interface ArticleFeedStateBase extends CommonState {
	articles: ApiArticleFeedItem[];
	page: number;
}

export interface ArticleFeedState {
	latest: ArticleFeedStateBase & {
		fetchLatestArticles: (page?: number) => void;
		refreshLatestArticles: () => void;
	};
	featured: ArticleFeedStateBase & {
		fetchFeaturedArticles: (page?: number) => void;
		refreshFeaturedArticles: () => void;
	};
}

const BASE_STATE: ArticleFeedStateBase = {
	articles: [],
	loading: false,
	error: false,
	refreshing: false,
	page: 1,
};

// TODO: reuse common behavior
const useArticleFeedStore = create<ArticleFeedState>()((set, get) => ({
	latest: {
		...BASE_STATE,
		fetchLatestArticles: async (page = 1) => {
			const { loading, articles } = get().latest;
			if (loading) {
				return;
			}

			set((state) => ({ ...state, latest: setFetchingState(state.latest) }));

			try {
				const response = await getArticlesList(
					ArticleFeedApiStates.Fresh,
					page,
					DEFAULT_PAGE_SIZE,
				);
				const responseArticles: ApiArticleFeedItem[] = await response.data;
				set((state) => ({
					...state,
					latest: {
						...state.latest,
						...BASE_STATE,
						page,
						articles: perfArrayConcat(articles, responseArticles),
					},
				}));
			} catch (e) {
				set((state) => ({ ...state, latest: setErrorState(state.latest) }));
			}
		},
		refreshLatestArticles: async () => {
			if (get().latest.refreshing) {
				return;
			}

			set((state) => ({ ...state, latest: setRefreshingState(state.latest) }));

			try {
				const response = await getArticlesList(
					ArticleFeedApiStates.Fresh,
					1,
					10,
				);

				const articles: ApiArticleFeedItem[] = await response.data;
				set((state) => ({
					...state,
					latest: { ...state.latest, ...BASE_STATE, articles },
				}));
				ToastAndroid.showWithGravity(
					HELP_TEXT.FEED_REFRESHED,
					ToastAndroid.SHORT,
					ToastAndroid.TOP,
				);
			} catch (e) {
				console.log("err", e);
				set((state) => ({ ...state, latest: setErrorState(state.latest) }));
			}
		},
	},
	featured: {
		...BASE_STATE,
		fetchFeaturedArticles: async (page = 1) => {
			const { loading, articles } = get().featured;
			if (loading) {
				return;
			}

			set((state) => ({
				...state,
				featured: setFetchingState(state.featured),
			}));

			try {
				const response = await getArticlesList(
					undefined,
					page,
					DEFAULT_PAGE_SIZE,
				);
				const responseArticles: ApiArticleFeedItem[] = await response.data;
				set((state) => ({
					...state,
					featured: {
						...state.featured,
						...BASE_STATE,
						page,
						articles: perfArrayConcat(articles, responseArticles),
					},
				}));
			} catch (e) {
				set((state) => ({ ...state, featured: setErrorState(state.featured) }));
			}
		},
		refreshFeaturedArticles: async () => {
			if (get().featured.refreshing) {
				return;
			}

			set((state) => ({
				...state,
				featured: setRefreshingState(state.featured),
			}));

			try {
				const response = await getArticlesList(undefined, 1, 10);
				const articles: ApiArticleFeedItem[] = await response.data;
				set((state) => ({
					...state,
					featured: { ...state.featured, ...BASE_STATE, articles },
				}));
				ToastAndroid.showWithGravity(
					HELP_TEXT.FEED_REFRESHED,
					ToastAndroid.SHORT,
					ToastAndroid.TOP,
				);
			} catch (e) {
				set((state) => ({ ...state, featured: setErrorState(state.featured) }));
			}
		},
	},
}));

export default useArticleFeedStore;
