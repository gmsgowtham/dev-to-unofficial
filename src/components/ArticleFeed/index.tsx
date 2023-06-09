import { ApiArticleFeedItem } from "../../api/types";
import ArticleFeedItem from "../ArticleFeedItem";
import {
	FlashList,
	FlashListProps,
	type ListRenderItem,
} from "@shopify/flash-list";
import { FunctionComponent, memo, useCallback } from "react";

type ArticleFeed = {
	data: ApiArticleFeedItem[];
	onItemClick: (id: number, title: string, url: string) => void;
	listProps?: Omit<
		FlashListProps<ApiArticleFeedItem>,
		"renderItem" | "data" | "estimatedItemSize"
	>;
};

const ArticleFeed: FunctionComponent<ArticleFeed> = ({
	data,
	onItemClick,
	listProps = {},
}) => {
	const renderItem: ListRenderItem<ApiArticleFeedItem> = useCallback(
		({ item }: { item: ApiArticleFeedItem }) => {
			return (
				<ArticleFeedItem
					id={item.id}
					title={item.title}
					description={item.description}
					dateReadable={item.readable_publish_date}
					coverImageUri={item.cover_image}
					url={item.canonical_url}
					author={{
						name: item.user.name,
						imageUri: item.user.profile_image_90,
					}}
					onItemClick={onItemClick}
					tags={item.tag_list}
				/>
			);
		},
		[],
	);

	return (
		<FlashList
			showsVerticalScrollIndicator={false}
			{...listProps}
			data={data}
			renderItem={renderItem}
			estimatedItemSize={377}
		/>
	);
};

export default memo(ArticleFeed);
