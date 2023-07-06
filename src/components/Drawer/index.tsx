import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { FunctionComponent, memo } from "react";
import { StyleSheet, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Divider, Drawer, Surface, Text } from "react-native-paper";

const CustomDrawer: FunctionComponent<DrawerContentComponentProps> = ({
	navigation,
}) => {
	const onBookmarksItemPress = () => {
		navigation.navigate("Bookmarks");
	};

	const onAboutItemPress = () => {
		navigation.navigate("About");
	};

	const onSettingItemPress = () => {
		navigation.navigate("Settings");
	};

	return (
		<Surface style={styles.container}>
			<View style={styles.logoContainer}>
				<FastImage
					source={require("./../../../assets/logo.png")}
					style={styles.logo}
					resizeMode={FastImage.resizeMode.cover}
				/>
				<Text variant="headlineSmall">UDev</Text>
			</View>
			<Divider />
			<View style={styles.itemsContainer}>
				<View>
					<Drawer.Item
						icon="bookmark"
						label="Bookmarks"
						onPress={onBookmarksItemPress}
					/>
					<Drawer.Item
						icon="information"
						label="About"
						onPress={onAboutItemPress}
					/>
				</View>
				<View>
					<Divider />
					<View style={styles.bottomOptionContainer}>
						<Drawer.Item
							icon={"cog"}
							label="Settings"
							onPress={onSettingItemPress}
						/>
					</View>
				</View>
			</View>
		</Surface>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	itemsContainer: {
		marginTop: 16,
		justifyContent: "space-between",
		flex: 1,
	},
	logoContainer: {
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		paddingVertical: 16,
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	bottomOptionContainer: {
		paddingVertical: 8,
	},
});

export default memo(CustomDrawer);
