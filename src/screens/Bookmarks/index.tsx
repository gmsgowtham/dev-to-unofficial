import ArticleFeedItem from "../../components/ArticleFeedItem";
import FloatingSvg from "../../components/Svg/Floating";
import { PostBookmarkItem, getBookmarks } from "../../mmkv/bookmark";
import { StackParamList } from "../../router/types";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import {
	FunctionComponent,
	memo,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";

type BookmarksScreenProps = NativeStackScreenProps<StackParamList, "Bookmarks">;

const BookmarksScreen: FunctionComponent<BookmarksScreenProps> = ({
	navigation,
}) => {
	const isFocused = useIsFocused();
	const [bookmarks, setBookmarks] = useState<PostBookmarkItem[]>([]);
	const onItemClick = (id: number, title: string, url: string) => {
		navigation.navigate("Article", { id, title, url });
	};
	const { width } = Dimensions.get("window");

	useEffect(() => {
		// Re-fetch bookmarks on focus
		// To avoid out of sync state when a bookmark is cancelled
		if (isFocused) {
			setBookmarks(getBookmarks());
		}
	}, [isFocused]);

	const renderItem: ListRenderItem<PostBookmarkItem> = useCallback(
		({ item }: { item: PostBookmarkItem }) => {
			return (
				<ArticleFeedItem
					id={item.id}
					title={item.title}
					author={{
						name: item.author.name,
						imageUri: item.author.imageUri,
					}}
					url={item.url}
					description=""
					dateReadable=""
					onItemClick={onItemClick}
				/>
			);
		},
		[],
	);

	return (
		<View style={styles.container}>
			<Appbar.Header elevated>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title={"Bookmarks"} />
			</Appbar.Header>
			{bookmarks.length < 1 ? (
				<View style={styles.noDataContainer}>
					<FloatingSvg width={width / 1.2} />
					<Text variant="labelLarge">It's void out there.....</Text>
				</View>
			) : (
				<View style={styles.listWrapper}>
					<FlashList
						showsVerticalScrollIndicator={false}
						onEndReachedThreshold={0.75}
						getItemType={(item) => item.type}
						contentContainerStyle={styles.listContainer}
						data={bookmarks}
						renderItem={renderItem}
						estimatedItemSize={200}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listWrapper: {
		flex: 1,
	},
	listContainer: {
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	noDataContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 24,
	},
});

export default memo(BookmarksScreen);
