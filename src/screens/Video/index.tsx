import { StackParamList } from "../../router/types";
import { logError } from "../../utils/log";
import { secondsToHMS } from "../../utils/time";
import Slider from "@react-native-community/slider";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MotiView } from "moti";
import {
	FunctionComponent,
	PropsWithChildren,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Linking,
	Pressable,
	Share,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from "react-native";
import {
	ActivityIndicator,
	Appbar,
	IconButton,
	Text,
	Tooltip,
	useTheme,
} from "react-native-paper";
import Video, {
	OnLoadData,
	OnProgressData,
	OnSeekData,
} from "react-native-video";

type Props = NativeStackScreenProps<StackParamList, "Video">;

const initialLoadHideTimeout = 2000;

const ArticleScreen: FunctionComponent<Props> = ({ route, navigation }) => {
	const { params } = route;
	const { source, title, url, cover } = params;
	const [videoData, setVideoData] = useState<OnLoadData | undefined>();
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isPaused, setIsPaused] = useState(false);
	const [isFullscreen, setIsFullScreen] = useState(false);
	const [shouldHideActions, setShouldHideActions] = useState(false);
	const playerRef = useRef<Video | null>(null);

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

	const onLoad = (data: OnLoadData) => {
		setVideoData(data);
		setIsLoading(false);
		hideActionsAfterTimeout();
	};

	const onBuffer = () => {
		setIsLoading(true);
	};

	const onProgress = (data: OnProgressData) => {
		setCurrentTime(data.currentTime);
		setIsLoading(false);
	};

	const hideActionsAfterTimeout = () => {
		// setTimeout(() => {
		// 	setShouldHideActions(true);
		// }, initialLoadHideTimeout);
	};

	const togglePauseState = () => {
		if (isPaused) hideActionsAfterTimeout();

		setIsPaused((isPaused) => !isPaused);
	};

	const onOverlayTouchEnd = () => {
		if (shouldHideActions) {
			setShouldHideActions(false);
		} else {
			setShouldHideActions(true);
		}
	};

	const onFullScreenPress = () => {
		setIsFullScreen((isFullscreen) => !isFullscreen);
	};

	const onSeek = (value: number) => {
		playerRef.current?.seek(value);
	};

	return (
		<View style={styles.container}>
			<Video
				ref={(ref) => playerRef.current === ref}
				source={{ uri: source }}
				style={styles.video}
				poster={cover}
				paused={isPaused}
				fullscreen={isFullscreen}
				progressUpdateInterval={750}
				onLoad={onLoad}
				onProgress={onProgress}
				onBuffer={onBuffer}
			/>
			{isLoading ? (
				<Overlay
					styles={{ alignItems: "center", justifyContent: "center" }}
					shouldHide={false}
				>
					<ActivityIndicator />
				</Overlay>
			) : (
				<Pressable onPress={onOverlayTouchEnd} style={styles.overlay}>
					<Overlay
						styles={{ justifyContent: "space-between" }}
						shouldHide={shouldHideActions && !isPaused}
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
								pointerEvents="box-none"
							/>
						</View>
						<BottomBar
							currentTime={currentTime}
							duration={videoData?.duration}
							isFullscreen={isFullscreen}
							onFullScreenPress={onFullScreenPress}
							onSeek={onSeek}
						/>
					</Overlay>
				</Pressable>
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
	currentTime: number;
	onSeek: (value: number) => void;
	duration?: number;
}

const BottomBar: FunctionComponent<BottomBarProps> = ({
	isFullscreen,
	onFullScreenPress,
	currentTime,
	duration = 1,
	onSeek,
}) => {
	const theme = useTheme();
	const durationToDisplay = useMemo(() => {
		return secondsToHMS(duration);
	}, [duration]);

	const timeToDisplay = useMemo(() => {
		return secondsToHMS(currentTime);
	}, [currentTime]);

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				gap: 8,
				paddingVertical: 16,
				paddingHorizontal: 8,
			}}
		>
			<View style={{ flex: 1 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginHorizontal: 16,
						marginBottom: 8,
					}}
				>
					<Text>{timeToDisplay}</Text>
					<Text>{durationToDisplay}</Text>
				</View>
				<Slider
					value={currentTime}
					minimumValue={0}
					maximumValue={duration}
					minimumTrackTintColor={theme.colors.primary}
					thumbTintColor={theme.colors.primary}
					maximumTrackTintColor={theme.colors.secondary}
					onSlidingComplete={onSeek}
				/>
			</View>
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

interface OverlayProps {
	shouldHide: boolean;
	styles?: StyleProp<ViewStyle>;
}

const Overlay: FunctionComponent<PropsWithChildren<OverlayProps>> = ({
	children,
	shouldHide,
	styles: _styles,
}) => {
	return (
		<MotiView
			style={[styles.overlay, _styles]}
			animate={{ opacity: shouldHide ? 0 : 1 }}
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
