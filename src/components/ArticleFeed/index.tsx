import { FunctionComponent, memo } from "react";
import {
	FlashList,
	FlashListProps,
	type ListRenderItem,
} from "@shopify/flash-list";
import { ApiArticleFeedItem } from "../../api/types";
import ArticleFeedItem from "../ArticleFeedItem";

type ArticleFeed = {
	data: ApiArticleFeedItem[];
	onItemClick: (id: number, title: string) => void;
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
	const renderItem: ListRenderItem<ApiArticleFeedItem> = ({ item, index }) => {
		return (
			<ArticleFeedItem
				id={item.id}
				title={item.title}
				description={item.description}
				dateReadable={item.readable_publish_date}
				coverImageUri={item.cover_image}
				author={{
					name: item.user.name,
					imageUri: item.user.profile_image_90,
				}}
				onItemClick={onItemClick}
				tags={item.tag_list}
			/>
		);
	};

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