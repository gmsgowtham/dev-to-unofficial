import ArticleCover from "../../components/ArticleCover";
import PageLoader from "../../components/Loader/PageLoader";
import RenderMarkdown from "../../components/Markdown";
import {
	isBookmarked,
	removeBookmark,
	savePostToBookmarks,
} from "../../mmkv/bookmark";
import { StackParamList } from "../../router/types";
import useArticleStore from "../../store/articles/article";
import { HELP_TEXT } from "../../utils/const";
import { logError } from "../../utils/log";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FunctionComponent, useCallback, useState } from "react";
import { Linking, Share, StyleSheet, ToastAndroid, View } from "react-native";
import { Appbar, Tooltip } from "react-native-paper";
import { shallow } from "zustand/shallow";

type Props = NativeStackScreenProps<StackParamList, "Article">;

const ArticleScreen: FunctionComponent<Props> = ({ route, navigation }) => {
	const { params } = route;
	const { id, title, url } = params;
	const _isPostBookmarked = isBookmarked(id);
	const [isPostBookmarked, setIsPostBookmarked] = useState(_isPostBookmarked);

	const { article, loading, fetchArticle, resetArticle } = useArticleStore(
		(state) => ({
			article: state.article,
			fetchArticle: state.fetchArticle,
			resetArticle: state.reset,
			loading: state.loading,
		}),
		shallow,
	);

	useFocusEffect(
		useCallback(() => {
			fetchArticle(id);

			return () => {
				// Resets article state
				resetArticle();
			};
		}, []),
	);

	const onBackActionPress = () => {
		navigation.goBack();
	};

	const onShareActionPress = async () => {
		try {
			await Share.share({
				message: url,
				url: url,
				title: title,
			});
		} catch (e) {
			logError(e as Error, "fn: onShareActionPress exception");
		}
	};

	const onOpenInBrowserActionPress = async () => {
		await Linking.openURL(url);
	};

	const onBookmarkActionPress = () => {
		if (isPostBookmarked) {
			setIsPostBookmarked(false);
			removeBookmark(id);
			ToastAndroid.showWithGravity(
				HELP_TEXT.BOOKMARK.REMOVED,
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
			);
		} else {
			if (!article) return;
			setIsPostBookmarked(true);
			const response = savePostToBookmarks({
				id,
				title,
				url,
				type: article.type_of,
				author: {
					name: article.user.name,
					imageUri: article.user.profile_image_90,
				},
			});
			if (!response.success) {
				// reset state
				setIsPostBookmarked(false);
			}
			ToastAndroid.showWithGravity(
				response.message,
				ToastAndroid.SHORT,
				ToastAndroid.TOP,
			);
		}
	};

	const renderListHeaderComponent = useCallback(() => {
		if (!article) {
			return null;
		}

		return (
			<ArticleCover
				title={title}
				cover={{
					uri: article?.cover_image,
				}}
				author={{
					name: article.user.name,
					imageUri: article.user.profile_image_90,
				}}
				dateReadable={article.readable_publish_date}
				tags={article.tags}
			/>
		);
	}, [article]);

	return (
		<View style={styles.container}>
			<Appbar.Header elevated>
				<Appbar.BackAction onPress={onBackActionPress} />
				<Appbar.Content title={""} />
				<Tooltip title="Share">
					<Appbar.Action
						icon="share"
						onPress={onShareActionPress}
						accessibilityHint="Share post"
						accessibilityLabel="Share post"
					/>
				</Tooltip>
				<Tooltip title="Bookmark">
					<Appbar.Action
						icon={isPostBookmarked ? "bookmark" : "bookmark-outline"}
						onPress={onBookmarkActionPress}
						accessibilityHint="Bookmark post"
						accessibilityLabel="Bookmark post"
					/>
				</Tooltip>
				<Tooltip title="Open in browser">
					<Appbar.Action
						icon="launch"
						onPress={onOpenInBrowserActionPress}
						accessibilityHint="Open in browser"
						accessibilityLabel="Open in browser"
					/>
				</Tooltip>
			</Appbar.Header>

			{!loading ? (
				typeof article?.body_markdown !== "undefined" ? (
					<RenderMarkdown
						value={article?.body_markdown}
						HeaderComponent={renderListHeaderComponent}
					/>
				) : null
			) : (
				<PageLoader />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listContainer: {
		margin: 8,
		padding: 4,
		paddingBottom: 24,
	},
});

export default ArticleScreen;
