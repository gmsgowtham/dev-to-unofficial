import { HELP_TEXT } from "../../utils/const";
import { getAbsURLFromAnchorMarkdown } from "../../utils/markdown";
import { LinkPreview, PreviewData } from "@flyerhq/react-native-link-preview";
import { FunctionComponent, memo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Surface, Text, useTheme } from "react-native-paper";

interface DevEmbedProps {
	url: string;
}

const DevEmbed: FunctionComponent<DevEmbedProps> = ({ url }) => {
	const theme = useTheme();
	const [previewData, setPreviewData] = useState<PreviewData | undefined>();

	const renderText = (url: string) => (
		<Text variant="bodySmall" numberOfLines={2}>
			{url}
		</Text>
	);

	const renderTitle = (title: string) => (
		<View style={styles.titleContainer}>
			<Avatar.Icon size={24} icon="launch" />
			<Text
				variant="titleMedium"
				style={[styles.title, { color: theme.colors.primary }]}
				numberOfLines={2}
			>
				{title}
			</Text>
		</View>
	);

	const noRender = () => null;

	const handlePreviewDataFetched = (data: PreviewData) => {
		if (!data.title || !data.link) {
			// has error
			setPreviewData({ ...data, title: HELP_TEXT.EXTERNAL_LINK, link: url });
		} else {
			setPreviewData(data);
		}
	};

	return (
		<Surface style={styles.container} mode="flat" elevation={2}>
			<LinkPreview
				text={getAbsURLFromAnchorMarkdown(url)}
				requestTimeout={1500}
				onPreviewDataFetched={handlePreviewDataFetched}
				previewData={previewData}
				renderText={renderText}
				renderTitle={renderTitle}
				renderImage={noRender}
				renderDescription={noRender}
			/>
		</Surface>
	);
};

const styles = StyleSheet.create({
	container: {
		borderRadius: 4,
		marginVertical: 8,
		height: 130,
	},
	titleContainer: {
		flexDirection: "row",
		gap: 8,
		flexWrap: "wrap",
		alignItems: "center",
	},
	title: {
		marginBottom: 8,
	},
});

export default memo(DevEmbed);
