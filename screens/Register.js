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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
	MATERIAL_COLORS,
	FONT_FAMILY,
	MATERIAL_FONTS_SIZES,
	VERBS,
} from "../constants";
import { validate } from "../validators/validator";
import { registerValidator } from "../validators/registerValidator";
import ProgressDialog from "../components/ProgressDialog";
import { useAppContext } from "../components/hooks/AppContext";
import ValidationMessage from "../components/ValidationMessage";
import PrivacyConsent from "../components/privacyConsent";
import { signUp } from "../api";
import Spacer from "../components/Spacer";
import { isIOS } from "../util/helpers";

const Register = ({ navigation }) => {
	const { saveUser, from, user, seller } = useAppContext();
	const [validationError, setValidationError] = useState({});
	const [fields, setFields] = useState(registerValidator.fields);
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		const { hasError, errors } = validate(fields, registerValidator.register);
		if (hasError) {
			setValidationError(errors);
			return;
		}

		try {
			setLoading(true)
			const { data, success } = await signUp(fields, VERBS.POST)
			if (success) {
				saveUser(data)
				switch (from) {
					case 'shopping-cart':
						navigation.replace("shopping-cart")
						break
					case 'profile':
						navigation.replace("profile")
						break
					case 'orders':
						navigation.replace("orders")
						break
					default:
						navigation.replace("bottomNavigator")
						break
				}
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
			Sign Up
		  </Text>
		  <View style={{ flex: 1 }} />
		</View>
	  )

	return (
		<SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
			<Spacer />
			<RenderHeader />
			<View style={styles.container}>
				

				<View style={{ marginVertical: 24 }}></View>				
				<View style={{ ...styles.titleContainer }}>
					<Text style={{ ...styles.title }}>Welcome to {seller?.name}</Text>
					<Text style={{ ...styles.small_title }}>Fill the form to continue</Text>
				</View>
				<View style={{ marginVertical: 16}}></View>
				<KeyboardAwareScrollView
					keyboardShouldPersistTaps={"always"}
					enableOnAndroid={true}
					bounces={false}
					showsVerticalScrollIndicator={false}
					style={{ flex: 1 }}
				>
					<View style={{ ...styles.inputContainer }}>
						<View style={styles.flexContainer}>
							<Text style={styles.label}>FirstName</Text>
							<View style={{ ...styles.input }}>
								<TextInput
									value={fields.firstname}
									placeholder="FirstName"
									placeholderTextColor={styles.placeholder}
									maxLength={50}
									autoCapitalize={"none"}
									autoCorrect={false}
									returnKeyType="next"
									onChangeText={(value) =>
										setFields({ ...fields, firstname: value })
									}
									style={{ ...styles.inputText }}
								></TextInput>
							</View>
							{validationError.first_name && (
								<ValidationMessage
									message={validationError.first_name.message}
								/>
							)}
						</View>
						<View style={styles.flexContainer}>
							<Text style={styles.label}>LastName</Text>
							<View style={{ ...styles.input }}>
								<TextInput
									value={fields.lastname}
									placeholder="LastName"
									placeholderTextColor={styles.placeholder}
									maxLength={50}
									autoCapitalize={"none"}
									autoCorrect={false}
									returnKeyType="next"
									onChangeText={(value) =>
										setFields({ ...fields, lastname: value })
									}
									style={{ ...styles.inputText }}
								></TextInput>
							</View>
							{validationError.last_name && (
								<ValidationMessage message={validationError.last_name.message} />
							)}
						</View>
						<View style={styles.flexContainer}>
							<Text style={styles.label}>Email</Text>
							<View style={[styles.input]}>

								<TextInput
									value={fields.email}
									placeholder="Email"
									placeholderTextColor={styles.placeholder}
									maxLength={50}
									keyboardType="email-address"
									autoCapitalize={"none"}
									autoCorrect={false}
									returnKeyType="next"
									onChangeText={(value) => setFields({ ...fields, email: value })}
									style={{ ...styles.inputText }}
								></TextInput>
							</View>
							{validationError.email && (
								<ValidationMessage message={validationError.email.message} />
							)}
						</View>
						<View style={styles.flexContainer}>
							<Text style={styles.label}>Mobile</Text>
							<View style={[styles.input]}>

								<TextInput
									value={fields.mobile}
									placeholder="Mobile"
									maxLength={25}
									autoCapitalize={"none"}
									autoCorrect={false}
									returnKeyType="done"
									onChangeText={(value) =>
										setFields({ ...fields, mobile: value })
									}
									style={{ ...styles.inputText }}
								></TextInput>
							</View>
							{validationError?.mobile && (
								<ValidationMessage message={validationError?.mobile.message} />
							)}
						</View>
						<PrivacyConsent />
						<View style={{ ...styles.row }}>
							<TouchableOpacity style={styles.button} onPress={onSubmit}>
								{loading && <ProgressDialog isVisible={loading} />}
								<Text style={styles.buttonText}>Sign Up</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								...styles.row,
								justifyContent: "center",
								marginTop: 16,
							}}
						>
							<Text style={styles.accountLabel}>Already have an account?</Text>
							<TouchableOpacity onPress={() => navigation.navigate("login")}>
								<Text style={styles.accountSignIn}> Sign in.</Text>
							</TouchableOpacity>
						</View>

					</View>
				</KeyboardAwareScrollView>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	flexContainer: {
		flex: 1
	},
	container: {
		flex: 1,
		backgroundColor: MATERIAL_COLORS.grey[1],
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 10,
		height: 56,
	},
	headerText: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	verticalDivideContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	verticalDivide: {
		height: 30,
		borderWidth: 0.5,
		borderColor: MATERIAL_COLORS.grey[900],
		paddingVertical: MATERIAL_FONTS_SIZES.font_size_large,
	},
	titleContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
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
	inputContainer: {
		marginHorizontal: 16,
	},
	input: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderColor: MATERIAL_COLORS.grey[500],
		borderRadius: 30,
		borderWidth: 1,
		paddingHorizontal: 20,
		marginVertical: 5,
	},
	inputText: {
		flex: 1,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		color: MATERIAL_COLORS.grey[900],
		height: isIOS ? 40 : null,
	},
	placeholder: {
		color: MATERIAL_COLORS.grey[600],
	},
	inputError: {
		borderColor: MATERIAL_COLORS.pink[100],
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	label: {
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		fontFamily: FONT_FAMILY.crimson_text_regular,
		color: MATERIAL_COLORS.grey[400],
	},
	accountLabel: {
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		fontFamily: FONT_FAMILY.crimson_text_regular,
		color: MATERIAL_COLORS.grey[600],
	},
	accountSignIn: {
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		fontFamily: FONT_FAMILY.crimson_text_regular,
		color: MATERIAL_COLORS.grey[800],
	},
	imageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	logo: {
		color: MATERIAL_COLORS.grey[200],
		fontFamily: FONT_FAMILY.crimson_text_bold,
	},
	button: {
		width: "100%",
		backgroundColor: MATERIAL_COLORS.cyan[500],
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 30,
		marginTop: 20,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		fontFamily: FONT_FAMILY.crimson_text_regular,
		color: MATERIAL_COLORS.grey[100],
		fontWeight: "bold",
	},
	inputContainerError: {
		borderColor: "#ff1744",
	},
	errorIconContainer: {
		paddingLeft: 10,
	},
	serverErrorContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
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
	label: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		marginLeft: 16
	},
});

export default Register;
