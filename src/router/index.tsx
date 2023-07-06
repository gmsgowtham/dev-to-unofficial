import CustomDrawer from "../components/Drawer";
import AboutScreen from "../screens/About";
import ArticleScreen from "../screens/Article";
import BookmarksScreen from "../screens/Bookmarks";
import LandingScreen from "../screens/LandingFeed";
import LatestScreen from "../screens/LatestFeed";
import SettingsScreen from "../screens/Settings";
import TermsAndConditionsScreen from "../screens/TermsAndConditions";
import VideoScreen from "../screens/Video";
import VideosScreen from "../screens/Videos";
import type { DrawerParamList, StackParamList, TabParamList } from "./types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	DrawerContentComponentProps,
	createDrawerNavigator,
} from "@react-navigation/drawer";
import {
	CommonActions,
	NavigationContainer,
	Theme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { FunctionComponent } from "react";
import { BottomNavigation } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const BottomTabs = () => {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerShown: false,
			}}
			tabBar={({ navigation, state, descriptors, insets }) => (
				<BottomNavigation.Bar
					shifting
					navigationState={state}
					safeAreaInsets={insets}
					onTabPress={({ route, preventDefault }) => {
						const event = navigation.emit({
							type: "tabPress",
							target: route.key,
							canPreventDefault: true,
						});

						if (event.defaultPrevented) {
							preventDefault();
						} else {
							navigation.dispatch({
								...CommonActions.navigate(route.name, route.params),
								target: state.key,
							});
						}
					}}
					renderIcon={({ route, focused, color }) => {
						const { options } = descriptors[route.key];
						if (options.tabBarIcon) {
							return options.tabBarIcon({ focused, color, size: 24 });
						}
						return null;
					}}
					getLabelText={({ route }) => {
						const { options } = descriptors[route.key];
						return options.tabBarLabel !== undefined &&
							typeof options.tabBarLabel === "string"
							? options.tabBarLabel
							: options.title !== undefined
							? options.title
							: route.name;
					}}
				/>
			)}
		>
			<Tab.Screen
				name="Latest"
				component={LatestScreen}
				options={{
					tabBarLabel: "Latest",
					tabBarIcon: ({ color, size }) => {
						return <Icon name="new-box" size={size} color={color} />;
					},
				}}
			/>
			<Tab.Screen
				name="Home"
				component={LandingScreen}
				options={{
					tabBarLabel: "Featured",
					tabBarIcon: ({ color, size }) => {
						return <Icon name="home" size={size} color={color} />;
					},
				}}
			/>
			<Tab.Screen
				name="Videos"
				component={VideosScreen}
				options={{
					tabBarLabel: "Videos",
					tabBarIcon: ({ color, size }) => {
						return <Icon name="video-box" size={size} color={color} />;
					},
				}}
			/>
		</Tab.Navigator>
	);
};

const DrawerNav = () => {
	return (
		<Drawer.Navigator
			initialRouteName="TabNav"
			screenOptions={{
				headerShown: false,
			}}
			drawerContent={(props: DrawerContentComponentProps) => (
				<CustomDrawer {...props} />
			)}
		>
			<Drawer.Screen name="TabNav" component={BottomTabs} />
		</Drawer.Navigator>
	);
};

type RouterProps = {
	theme: Theme;
	onReady?: () => void;
};

const Router: FunctionComponent<RouterProps> = ({ theme, onReady }) => {
	return (
		<NavigationContainer theme={theme} onReady={onReady}>
			<Stack.Navigator
				screenOptions={{ headerShown: false }}
				initialRouteName="Landing"
			>
				<Stack.Screen name="Landing" component={DrawerNav} />
				<Stack.Screen name="Article" component={ArticleScreen} />
				<Stack.Screen name="Bookmarks" component={BookmarksScreen} />
				<Stack.Screen name="Video" component={VideoScreen} />
				<Stack.Screen name="About" component={AboutScreen} />
				<Stack.Screen name="Settings" component={SettingsScreen} />
				<Stack.Screen
					name="TermsAndConditions"
					component={TermsAndConditionsScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Router;
