import {
	DEFAULT_THEME,
	THEME_VALUES,
	useUserColorScheme,
} from "../../mmkv/colorScheme";
import { HELP_TEXT } from "../../utils/const";
import Clipboard from "@react-native-clipboard/clipboard";
import React, { FunctionComponent, memo, useMemo } from "react";
import {
	ColorSchemeName,
	StyleSheet,
	TextStyle,
	ToastAndroid,
	View,
	ViewStyle,
	useColorScheme,
} from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import { IconButton, Text as PaperText } from "react-native-paper";
import {
	stackoverflowDark as darkStyle,
	stackoverflowLight as lightStyle,
} from "react-syntax-highlighter/dist/esm/styles/hljs";

interface HighlighterProps {
	code: string;
	containerStyle?: ViewStyle;
	textStyle?: TextStyle;
	language?: string;
}

export const SyntaxHighlighter: FunctionComponent<HighlighterProps> = ({
	code,
	containerStyle,
	textStyle,
	language,
}) => {
	const [userColorScheme] = useUserColorScheme();
	const systemColorScheme = useColorScheme();

	const onCopyCodePress = () => {
		Clipboard.setString(code);
		ToastAndroid.showWithGravity(
			HELP_TEXT.CODE_COPY,
			ToastAndroid.SHORT,
			ToastAndroid.TOP,
		);
	};

	const hlsStyles = useMemo(() => {
		let colorScheme: ColorSchemeName;
		if (userColorScheme === THEME_VALUES.System) {
			colorScheme = systemColorScheme ?? DEFAULT_THEME;
		} else {
			colorScheme = userColorScheme as ColorSchemeName;
		}

		if (colorScheme === THEME_VALUES.Light) return lightStyle;
		return darkStyle;
	}, [userColorScheme, systemColorScheme]);

	return (
		<>
			<View
				style={[
					styles.header,
					{ backgroundColor: containerStyle?.backgroundColor },
				]}
			>
				<PaperText variant="labelMedium" style={styles.title}>{`${
					language || "code"
				} snippet`}</PaperText>
				<IconButton
					icon="content-copy"
					size={16}
					accessibilityLabel="copy code"
					aria-label="copy code"
					onPress={onCopyCodePress}
				/>
			</View>
			<CodeHighlighter
				hljsStyle={hlsStyles}
				language={language}
				containerStyle={containerStyle}
				textStyle={textStyle}
			>
				{code}
			</CodeHighlighter>
		</>
	);
};

const styles = StyleSheet.create({
	header: {
		paddingLeft: 16,
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	title: {
		textTransform: "uppercase",
	},
});

export default memo(SyntaxHighlighter);
