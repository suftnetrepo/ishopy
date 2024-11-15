import React, { useEffect, useState } from "react";
import {
	StatusBar,
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	ToastAndroid,
	Platform,
	Image
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
	MATERIAL_COLORS,
	FONT_FAMILY,
	MATERIAL_FONTS_SIZES,
	MATERIAL_SPACING,
	VERBS
} from "../constants";
import ProgressDialog from "../components/ProgressDialog";
import { validate } from "../validators/validator";
import { registerValidator } from "../validators/registerValidator";
import { useAppContext } from "../components/hooks/AppContext";
import ValidationMessage from "../components/ValidationMessage";
import { deleteCustomer } from "../api";
import Spacer from "../components/Spacer";
import ConfirmDialog from "../components/ConfirmDialog";

const EditProfile = ({ navigation }) => {
	const { saveUser, user, token, logout } = useAppContext();
	const [validationError, setValidationError] = useState({});
	const [loading, setLoading] = useState(false);
	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const [fields, setFields] = useState(registerValidator.fields);

	useEffect(() => {

		if (user) {
			setFields((pre) => {
				return {
					...(user && { ...user })
				}
			})
		}

	}, [user])

	const onSaveChanges = async () => {
		const { hasError, errors } = validate(fields, registerValidator.register);
		if (hasError) {
			setValidationError(errors);
			return;
		}

		try {
			setLoading(true)
			const { company, fcm_token, type, ...Updates } = fields
			const { data, success } = await updateCustomer({ ...Updates, _id: user._id }, VERBS.POST, token)

			if (success) {
				saveUser(data)
				if (Platform.OS === "android") {
					ToastAndroid.show("Your profile updates have been successfully saved.", ToastAndroid.SHORT)
				}
				navigation.navigate("settings")
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false)
		}
	};

	const handleDeleteCustomer = async () => {
		try {
			setLoading(true)
			const { success } = await deleteCustomer({ _id: user._id }, VERBS.POST, token)

			if (success) {
				logout(data)
				navigation.navigate("login")
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false)
		}
	}

	const handleShowConfirmDialogue = async () => {
		setIsDialogVisible(true);
	}

	const handleCancel = () => {
		setIsDialogVisible(false);
	};


	const RenderHeader = () => (
		<View style={styles.header}>
			<View style={styles.iconContainer}>
				<Icon
					name="arrow-left"
					size={30}
					color={MATERIAL_COLORS.grey[800]}
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
				My Profile
			</Text>
			<View style={{ flex: 1 }} />
			<Icon
				name="delete"
				size={30}
				color={MATERIAL_COLORS.grey[800]}
				onPress={() => handleShowConfirmDialogue()}
			/>
		</View>
	)

	return (
		<SafeAreaView style={styles.container}>
			<Spacer />
			<RenderHeader />
			<View style={{ ...styles.columnContainer }}>
				<Image
					style={styles.image}
					source={require("../assets/images/no_image.png")}
					resizeMode="cover"
				/>
			</View>
			<View style={{ ...styles.columnContainer }}>
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
						{validationError.firstname && (
							<ValidationMessage
								message={validationError.firstname.message}
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
						{validationError.lastname && (
							<ValidationMessage message={validationError.lastname.message} />
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
								returnKeyType="done"
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
					<View style={{ ...styles.row }}>
						<TouchableOpacity style={{ ...styles.button, ...styles.row, justifyContent: 'center' }} onPress={onSaveChanges}>
							<Text style={styles.buttonText}>Save Change</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			{loading && <ProgressDialog isVisible={loading} />}
			<ConfirmDialog
				visible={isDialogVisible}
				title={"Confirmation"}
				onCancel={handleCancel}
				onConfirm={handleDeleteCustomer}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	label: {
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		fontFamily: FONT_FAMILY.crimson_text_regular,
		color: MATERIAL_COLORS.grey[800],
		marginLeft: 16
	},
	flexContainer: {

	},
	container: {
		flex: 1,

	},
	header: {
		alignItems: 'center',
		backgroundColor: MATERIAL_COLORS.grey[1],
		flexDirection: 'row',
		justifyContent: 'flex-start',
		paddingHorizontal: MATERIAL_SPACING.spacing_medium_14,
		paddingVertical: 8
	},
	headerText: {
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		marginHorizontal: 8,
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
	verticalDivideContainer: {
		height: 50,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	verticalDivide: {
		height: 15,
		borderWidth: 0.5,
		borderColor: MATERIAL_COLORS.grey[900],
		paddingVertical: MATERIAL_FONTS_SIZES.font_size_large,
	},
	titleContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontFamily: FONT_FAMILY.crimson_text_bold,
		fontSize: MATERIAL_FONTS_SIZES.font_size_xxxlarge,
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
		backgroundColor: MATERIAL_COLORS.grey[1],
	},
	inputText: {
		flex: 1,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		color: MATERIAL_COLORS.grey[900],
		height: 40
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
		marginTop: 8,

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
	columnContainer: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		borderRadius: 60,
		height: 120,
		width: 120,
		marginTop: 30
	},
});

export default EditProfile;
