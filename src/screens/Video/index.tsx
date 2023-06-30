import { StackParamList } from "../../router/types";
import { logError } from "../../utils/log";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MotiView } from "moti";
import { FunctionComponent, PropsWithChildren, useRef, useState } from "react";
import {
	Dimensions,
	Linking,
	Share,
	StyleProp,
	StyleSheet,
	View,
	ViewProps,
	ViewStyle,
} from "react-native";
import {
	ActivityIndicator,
	Appbar,
	FAB,
	IconButton,
	Text,
	Tooltip,
} from "react-native-paper";
import Video from "react-native-video";

type Props = NativeStackScreenProps<StackParamList, "Video">;

const { width } = Dimensions.get("window");

const ArticleScreen: FunctionComponent<Props> = ({ route, navigation }) => {
	const { params } = route;
	const { source, title, url, cover } = params;
	const [isLoading, setIsLoading] = useState(true);
	const [isPaused, setIsPaused] = useState(false);
	const [isFullscreen, setIsFullScreen] = useState(false);
	const [shouldHideActions, setShouldHideActions] = useState(false);
	const playerRef = useRef<Video | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout>>();
	const timeout = 5000;

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

	const onLoad = () => {
		setIsLoading(false);
		startHideActionTimeout();
	};

	const startHideActionTimeout = () => {
		timerRef.current = setTimeout(() => {
			setShouldHideActions(true);
		}, timeout);
	};

	const stopHideActionTimeout = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
	};

	const togglePauseState = () => {
		if (!isPaused)
			stopHideActionTimeout(); // Clear the timeout when video gets paused
		else startHideActionTimeout(); // Start the timeout when video gets played

		setIsPaused((isPaused) => !isPaused);
	};

	const onOverlayTouchEnd = () => {
		if (shouldHideActions) {
			setShouldHideActions(false);
			startHideActionTimeout(); // Start the timeout when overlay is presented
		} else {
			setShouldHideActions(true);
			stopHideActionTimeout(); // Clear the timeout when overlay gets hidden
		}
	};

	return (
		<View style={styles.container}>
			<Video
				ref={(ref) => playerRef.current === ref}
				source={{ uri: source }}
				style={styles.video}
				poster={cover}
				onLoad={onLoad}
				paused={isPaused}
				fullscreen={isFullscreen}
			/>
			{isLoading ? (
				<Overlay
					styles={{ alignItems: "center", justifyContent: "center" }}
					shouldHide={false}
				>
					<ActivityIndicator />
				</Overlay>
			) : (
				<Overlay
					styles={{ justifyContent: "space-between" }}
					shouldHide={shouldHideActions && !isPaused}
					onTouchEnd={onOverlayTouchEnd}
				>
					<TopBar
						onBackActionPress={onBackActionPress}
						onShareActionPress={onShareActionPress}
						onOpenInBrowserActionPress={onOpenInBrowserActionPress}
					/>
					<View style={{ alignItems: "center" }}>
						<IconButton
							icon={isPaused ? "play" : "pause"}
							size={50}
							onPress={togglePauseState}
							mode="contained-tonal"
						/>
					</View>
					<BottomBar
						isFullscreen={isFullscreen}
						onFullScreenPress={() =>
							setIsFullScreen((isFullscreen) => !isFullscreen)
						}
					/>
				</Overlay>
			)}
		</View>
	);
};

interface TopBarProps {
	onBackActionPress: () => void;
	onShareActionPress: () => void;
	onOpenInBrowserActionPress: () => void;
}

const TopBar: FunctionComponent<TopBarProps> = ({
	onBackActionPress,
	onShareActionPress,
	onOpenInBrowserActionPress,
}) => (
	<View>
		<Appbar.Header style={{ backgroundColor: "transparent" }}>
			<Appbar.BackAction onPress={onBackActionPress} />
			<Appbar.Content title="" />
			<Tooltip title="Share">
				<Appbar.Action
					icon="share"
					onPress={onShareActionPress}
					accessibilityHint="Share video"
					accessibilityLabel="Share video"
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
	</View>
);

interface BottomBarProps {
	isFullscreen: boolean;
	onFullScreenPress: () => void;
}

const BottomBar: FunctionComponent<BottomBarProps> = ({
	isFullscreen,
	onFullScreenPress,
}) => {
	return (
		<View>
			<Tooltip title="Fullscreen">
				<IconButton
					icon={isFullscreen ? "fullscreen-exit" : "fullscreen"}
					size={24}
					onPress={onFullScreenPress}
					accessibilityHint="Toggle fullscreen"
					accessibilityLabel="Toggle fullscreen"
				/>
			</Tooltip>
		</View>
	);
};

interface OverlayProps extends ViewProps {
	shouldHide: boolean;
	styles?: StyleProp<ViewStyle>;
}

const Overlay: FunctionComponent<PropsWithChildren<OverlayProps>> = ({
	children,
	shouldHide,
	styles: _styles,
	...props
}) => {
	return (
		<MotiView
			style={[styles.overlay, _styles]}
			animate={{ opacity: shouldHide ? 0 : 1 }}
			{...props}
		>
			{children}
		</MotiView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
		position: "relative",
	},
	listContainer: {
		margin: 8,
		padding: 4,
		paddingBottom: 24,
	},
	video: {
		flex: 1,
	},
	overlay: {
		flex: 1,
		position: "absolute",
		width: "100%",
		height: "100%",
	},
});

export default ArticleScreen;
