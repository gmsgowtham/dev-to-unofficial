import { COLOR_SCHEME_VALUES } from "../../mmkv/colorScheme";
import { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";

interface Props {
	visible: boolean;
	onDismiss: () => void;
	onThemeSelectPress: (v: string) => void;
}

const ThemeSwitcher: FunctionComponent<Props> = ({
	visible,
	onDismiss,
	onThemeSelectPress,
}) => {
	const theme = useTheme();

	return (
		<Portal>
			<Modal
				dismissableBackButton
				visible={visible}
				onDismiss={onDismiss}
				contentContainerStyle={[
					styles.modal,
					{ backgroundColor: theme.colors.surface },
				]}
			>
				<View style={styles.modalWrapper}>
					<Text variant="labelLarge">Choose Theme</Text>
					<View style={styles.modalButtonGroup}>
						<Button
							contentStyle={styles.buttonContent}
							icon={"palette"}
							uppercase
							mode="text"
							onPress={() => onThemeSelectPress(COLOR_SCHEME_VALUES.System)}
						>
							{COLOR_SCHEME_VALUES.System}
						</Button>
						<Button
							contentStyle={styles.buttonContent}
							icon={"white-balance-sunny"}
							uppercase
							mode="text"
							onPress={() => onThemeSelectPress(COLOR_SCHEME_VALUES.Light)}
						>
							{COLOR_SCHEME_VALUES.Light}
						</Button>
						<Button
							contentStyle={styles.buttonContent}
							icon={"moon-waning-crescent"}
							uppercase
							mode="text"
							onPress={() => onThemeSelectPress(COLOR_SCHEME_VALUES.Dark)}
						>
							{COLOR_SCHEME_VALUES.Dark}
						</Button>
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

const styles = StyleSheet.create({
	modal: {
		padding: 20,
		marginHorizontal: "10%",
	},
	modalWrapper: {
		gap: 24,
	},
	modalButtonGroup: {
		gap: 8,
	},
	buttonContent: {
		justifyContent: "flex-start",
		gap: 8,
	},
});

export default ThemeSwitcher;
