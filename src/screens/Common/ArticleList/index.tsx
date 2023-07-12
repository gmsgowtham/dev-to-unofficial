import { ApiArticleFeedItem } from "../../../api/types";
import HomeAppbar from "../../../components/Appbar/HomeAppbar";
import ArticleFeed from "../../../components/ArticleFeed";
import ListFooterLoader from "../../../components/List/ListFooterLoader";
import FeedSkeleton from "../../../components/Skeleton/FeedSkeleton";
import { StackParamList } from "../../../router/types";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FunctionComponent, memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";

interface ArticleFeedProps {
	title: string;
	articles: ApiArticleFeedItem[];
	fetchArticles: (page: number) => void;
	refreshing: boolean;
	refreshArticles: () => void;
	page: number;
	loading: boolean;
}

const ArticleFeedScreen: FunctionComponent<ArticleFeedProps> = ({
	articles,
	fetchArticles,
	refreshing,
	refreshArticles,
	page,
	loading,
	title,
}) => {
	useEffect(() => {
		fetchArticles(page);
	}, []);

	const navigation = useNavigation<NavigationProp<StackParamList>>();

	const onItemClick = (id: number, title: string, url: string) => {
		navigation.navigate("Article", { id, title, url });
	};

	const onEndReached = () => {
		if (articles.length < 1) return;

		const next = page + 1;
		fetchArticles(next);
	};

	return (
		<View style={{ flex: 1 }}>
			<HomeAppbar title={title} />
			{loading && articles.length < 1 ? (
				<FeedSkeleton />
			) : (
				<View style={styles.listWrapper}>
					<ArticleFeed
						data={articles}
						onItemClick={onItemClick}
						listProps={{
							refreshing,
							onRefresh: refreshArticles,
							onEndReached: onEndReached,
							onEndReachedThreshold: 0.75,
							getItemType: (item) => item.type_of,
							ListFooterComponent: () => <ListFooterLoader loading={loading} />,
							contentContainerStyle: styles.listContainer,
						}}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	listWrapper: {
		flex: 1,
	},
	listContainer: {
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
});

export default memo(ArticleFeedScreen);
