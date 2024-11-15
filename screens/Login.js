import React, { useState } from "react";
import {
	StatusBar,
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
	MATERIAL_COLORS,
	FONT_FAMILY,
	MATERIAL_FONTS_SIZES,
	VERBS,
} from "../constants";
import { validate } from "../validators/validator";
import { loginValidator } from "../validators/loginValidator";
import ProgressDialog from "../components/ProgressDialog";
import ValidationMessage from "../components/ValidationMessage";
import { verifyAppCode } from "../api";
import Spacer from "../components/Spacer";
import { useAppContext } from "../components/hooks/AppContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Login = ({ navigation }) => {
	const { seller } = useAppContext()
	const [validationError, setValidationError] = useState({});
	const [fields, setFields] = useState(loginValidator.fields);
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		const { hasError, errors } = validate(fields, loginValidator.rules);
		if (hasError) {
			setValidationError(errors);
			return;
		}

		try {
			setLoading(true)
			const { success } = await verifyAppCode(fields, VERBS.POST)
			if (success) {
				navigation.replace("codeVerification", fields);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false)
		}
	};

	const RenderHeader = () => (
		<View style={styles.header}>
			<View style={styles.iconContainer}>
				<Icon
					name="arrow-left"
					size={30}
					color={MATERIAL_COLORS.grey[700]}
					onPress={() => navigation.goBack()}
				/>
			</View>
			<Text
				style={{
					color: MATERIAL_COLORS.grey[700],
					fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
					marginLeft: 8
				}}
			>
				Sign In
			</Text>
			<View style={{ flex: 1 }} />
		</View>
	)

	return (
		<SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
			<Spacer />
			<RenderHeader />
			<View style={styles.container}>

				<View style={{ ...styles.titleContainer }}>
					<Text style={{ ...styles.title }}>Welcome to {seller?.name}</Text>
					<Text style={{ ...styles.small_title }}>Enter your email to continue</Text>
				</View>
				<View style={{ marginVertical: 8 }}></View>
				<KeyboardAwareScrollView
					keyboardShouldPersistTaps={"always"}
					enableOnAndroid={true}
					bounces={false}
					showsVerticalScrollIndicator={false}
					style={{ flex: 1 }}
				>
					<View style={{ ...styles.inputContainer }}>
						<Text style={styles.label}>Email</Text>
						<TextInput
								value={fields.email}
								placeholder="Email"
								maxLength={50}
								keyboardType="email-address"
								autoCapitalize={"none"}
								autoCorrect={false}
								onChangeText={(value) => setFields({ ...fields, email: value })}
								style={{ ...styles.inputText }}
							></TextInput>
						{validationError.email && (
							<ValidationMessage message={validationError.email.message} />
						)}
						<View style={{ ...styles.row }}>
							<TouchableOpacity style={styles.button} onPress={onSubmit}>
								{loading && <ProgressDialog isVisible={loading} />}
								<Text style={styles.buttonText}>Sign In</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								...styles.row,
								justifyContent: "center",
								marginTop: 8,
							}}
						>
							<Text style={styles.noAccountLabel}> Don't have an account?</Text>
							<TouchableOpacity onPress={() => navigation.navigate("register")}>
								<Text style={styles.noAccountSignUp}> Sign up.</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAwareScrollView>

			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		backgroundColor: MATERIAL_COLORS.cyan[500],
		borderRadius: 30,
		flexDirection: "column",
		justifyContent: "center",
		marginTop: 8,
		paddingHorizontal: 20,
		paddingVertical: 10,
		width: "100%",
	},
	buttonText: {
		color: MATERIAL_COLORS.grey[100],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		fontWeight: "bold",
	},
	container: {
		backgroundColor: MATERIAL_COLORS.grey[1],
		flex: 1,
		flexDirection: 'column',

		alignItems: 'center',
		paddingTop: 64
	},
	errorIconContainer: {
		paddingLeft: 10,
	},
	header: {
		alignItems: "center",
		flexDirection: "row",
		height: 56,
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	headerText: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	iconContainer: {
		alignItems: 'center',
		borderColor: MATERIAL_COLORS.grey[500],
		borderRadius: 24,
		borderWidth: 1,
		flexDirection: 'column',
		height: 48,
		justifyContent: 'center',
		width: 48,
	},
	imageContainer: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	input: {
		alignItems: "center",
		borderColor: MATERIAL_COLORS.grey[500],
		borderRadius: 30,
		borderWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
		paddingHorizontal: 20,
	},
	inputContainer: {
		marginHorizontal: 16,
	},
	inputContainerError: {
		borderColor: "#ff1744",
	},
	inputError: {
		borderColor: MATERIAL_COLORS.pink[100],
	},
	inputText: {
		color: MATERIAL_COLORS.grey[900],
		height: 35,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		alignItems: "center",
		borderColor: MATERIAL_COLORS.grey[500],
		borderRadius: 30,
		borderWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 5,
		paddingHorizontal: 20,
	},
	label: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		marginLeft: 16
	},

	logo: {
		color: MATERIAL_COLORS.grey[200],
		fontFamily: FONT_FAMILY.crimson_text_bold,
	},
	noAccountLabel: {
		color: MATERIAL_COLORS.grey[600],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		marginLeft: 30,
	},
	noAccountSignUp: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
	},
	row: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	serverErrorContainer: {
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
	},
	small_title: {
		color: MATERIAL_COLORS.grey[500],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		marginBottom: 20,
	},
	title: {
		fontFamily: FONT_FAMILY.crimson_text_bold,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
	},
	titleContainer: {
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
	},
	verticalDivide: {
		borderColor: MATERIAL_COLORS.grey[900],
		borderWidth: 0.5,
		height: 30,
		paddingVertical: MATERIAL_FONTS_SIZES.font_size_large,
	},
	verticalDivideContainer: {
		alignItems: "center",
		flexDirection: "row",
		height: 100,
		justifyContent: "center",
	},
});

export default Login;
