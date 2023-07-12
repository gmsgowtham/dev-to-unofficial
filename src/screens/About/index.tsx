import Link from "../../components/Link";
import { StackParamList } from "../../router/types";
import { NPM_HOST } from "../../utils/const";
import meta from "./../../../package.json";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";

type Props = NativeStackScreenProps<StackParamList, "About">;

const AboutScreen: FunctionComponent<Props> = ({ navigation }) => {
	const renderDeps = () => {
		const dependencies = {
			...meta.dependencies,
			...meta.devDependencies,
		} as Record<string, string>;
		return (
			<>
				{Object.keys(dependencies).map((key, index) => {
					const version = dependencies[key] as string;
					return (
						<View style={styles.library} key={key}>
							<Text style={styles.libraryId}>{index + 1}.</Text>
							<View style={styles.libraryInfo}>
								{/* <Text>{key}</Text> */}
								<Link url={`${NPM_HOST}/package/${key}`}>{key}</Link>
								<Text>@{version}</Text>
							</View>
						</View>
					);
				})}
			</>
		);
	};

	return (
		<>
			<Appbar.Header elevated>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title={"About"} />
			</Appbar.Header>
			<ScrollView contentContainerStyle={styles.container}>
				<Text variant="bodyMedium" style={styles.description}>
					UDev is an unofficial client for the popular developer community
					platform, dev.to. It provides a seamless mobile experience for
					developers to explore, read, and engage with the vibrant community of
					tech enthusiasts, programmers, and industry experts. Stay up-to-date
					with the latest articles, discussions, and trends in software
					development, web development, AI, machine learning, and many more
					exciting topics.
				</Text>

				<Text variant="titleLarge" style={styles.sectionHeading}>
					Open Source Libraries Used:
				</Text>
				{renderDeps()}

				<Text variant="titleLarge" style={styles.sectionHeading}>
					Acknowledgements:
				</Text>
				<Text variant="bodyMedium" style={styles.description}>
					We extend our sincere appreciation to the creators and maintainers of
					the open source libraries we've incorporated into our app. Their hard
					work, dedication, and expertise have played an integral role in the
					development of our app. We are grateful for their contributions to the
					open source ecosystem and the positive impact they have made on our
					project.
				</Text>

				<Text variant="titleLarge" style={styles.sectionHeading}>
					License Information:
				</Text>
				<Text variant="bodyMedium" style={styles.description}>
					The open source libraries we've utilized are subject to their
					respective licenses. We respect and comply with the terms and
					conditions set forth by each license. To learn more about the licenses
					governing the open source libraries used in our app, please refer to
					the individual libraries' documentation and license files.
				</Text>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
	},
	description: {
		marginBottom: 8,
	},
	sectionHeading: {
		marginTop: 16,
		marginBottom: 8,
	},
	library: {
		marginBottom: 4,
		flexDirection: "row",
		gap: 2,
	},
	libraryId: {
		width: 24,
		textAlign: "center",
	},
	libraryInfo: {
		flexDirection: "row",
		flex: 1,
		flexWrap: "wrap",
	},
});

export default AboutScreen;
