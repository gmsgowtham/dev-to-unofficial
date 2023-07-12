import { API_BASE_URL, NETWORK_TIMEOUT_MS } from "../utils/const";
import { buildURLParams } from "../utils/url";
import type { ArticleFeedApiStates } from "./types";
import axios from "axios";

export const getArticlesList = (
	state?: ArticleFeedApiStates,
	page = 1,
	perPage = 10,
) => {
	const params = buildURLParams({ state, page, per_page: perPage });
	return axios.get(`${API_BASE_URL}/articles?${params}`, {
		timeout: NETWORK_TIMEOUT_MS,
	});
};

export const getVideos = (page: number, perPage: number) => {
	const params = buildURLParams({ page, per_page: perPage });
	return axios.get(`${API_BASE_URL}/videos?${params}`, {
		timeout: NETWORK_TIMEOUT_MS,
	});
};

export const getArticle = (id: number) => {
	return axios.get(`${API_BASE_URL}/articles/${id}`, {
		timeout: NETWORK_TIMEOUT_MS,
	});
};
