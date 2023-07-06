import RenderMarkdown from "../../components/MD/index";
import { StackParamList } from "../../router/types";
import TERM_AND_CONDITION_MARKDOWN from "./md";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FunctionComponent } from "react";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";

type Props = NativeStackScreenProps<StackParamList, "TermsAndConditions">;

const TermsAndConditionsScreen: FunctionComponent<Props> = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<Appbar.Header elevated>
				<Appbar.BackAction onPress={() => navigation.goBack()} />
				<Appbar.Content title="Terms & Conditions" />
			</Appbar.Header>
			<RenderMarkdown value={TERM_AND_CONDITION_MARKDOWN} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 60,
	},
});

export default TermsAndConditionsScreen;
