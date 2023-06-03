import { FunctionComponent, memo } from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Avatar, Card, Text } from "react-native-paper";
import { ARTICLE_COVER_IMAGE_ASPECT_RATIO } from "../../utils/const";

interface author {
	imageUri: string;
	name: string;
}

interface ArticleFeedItemProps {
	id: number;
	title: string;
	description: string;
	author: author;
	dateReadable: string;
	url: string;
	onItemClick: (id: number, title: string, url: string) => void;
	tags?: string[];
	organizationName?: string;
	coverImageUri?: string | null;
}

interface TagListProps {
	tags?: string[];
}

const TagList = memo<TagListProps>(({ tags = [] }) => {
	if (tags.length < 1) {
		return <></>;
	}

	return (
		<View style={styles.tags}>
			{tags.map((t, index) => (
				<Text key={`${t}${index}`}>#{t}</Text>
			))}
		</View>
	);
});

const ArticleFeedItem: FunctionComponent<ArticleFeedItemProps> = ({
	id,
	title,
	description,
	coverImageUri,
	author,
	dateReadable,
	onItemClick,
	tags,
	url,
}) => {
	const onClick = () => {
		onItemClick(id, title, url);
	};

	return (
		<Card style={styles.card} onPress={onClick}>
			{coverImageUri ? (
				<FastImage
					source={{ uri: coverImageUri }}
					style={styles.cover}
					resizeMode={FastImage.resizeMode.contain}
				/>
			) : null}
			<Card.Title
				title={author.name}
				subtitle={dateReadable}
				subtitleVariant="bodySmall"
				left={({ size }) => (
					<Avatar.Image size={size} source={{ uri: author.imageUri }} />
				)}
			/>
			<Card.Content>
				<Text variant="titleLarge" style={styles.title}>
					{title}
				</Text>
				<Text variant="bodyMedium">{description}</Text>
				<TagList tags={tags} />
			</Card.Content>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginVertical: 4,
	},
	cover: {
		width: "100%",
		aspectRatio: ARTICLE_COVER_IMAGE_ASPECT_RATIO,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
	},
	content: {
		marginTop: 16,
	},
	title: {
		marginBottom: 8,
	},
	tags: {
		flexDirection: "row",
		gap: 8,
		marginTop: 8,
		flexWrap: "wrap",
	},
	actionsWrapper: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default memo(ArticleFeedItem);
