/* eslint-disable react-native/split-platform-components */
import React, { useState, useRef } from "react";
import {
	StatusBar,
	View,
	Text,
	StyleSheet,
	TextInput,
		ToastAndroid,
	TouchableOpacity,
	Platform,
	SafeAreaView
} from "react-native";
import {
	MATERIAL_COLORS,
	FONT_FAMILY,
	MATERIAL_FONTS_SIZES,
	VERBS,
	MATERIAL_SPACING
} from "../constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { otpValidator } from "../validators/otpValidator";
import ProgressDialog from "../components/ProgressDialog";
import { validate } from "../validators/validator";
import { useAppContext } from "../components/hooks/AppContext";
import { verifyAppCode, verifyUserByOtp } from "../api";
import Spacer from "../components/Spacer";

const CodeVerification = ({ navigation, route }) => {
	const { saveUser, from } = useAppContext();
	const [validationError, setValidationError] = useState({});
	const [fields, setFields] = useState(otpValidator.fields);
	const [loading, setLoading] = useState(false);
	const inputRefs = [
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
		useRef(null),
	];

	const handleTextChange = (value, index) => {
		const updatedFields = { ...fields };
		const key = `t${index + 1}`;
		updatedFields[key] = value;
		setFields(updatedFields);

		if (value.length === 1 && index < 5) {
			inputRefs[index + 1].current.focus();
		}
	};

	const onSubmit = async () => {
		const { hasError, errors } = validate(fields, otpValidator.rules);
		if (hasError) {
			setValidationError(errors);
			return;
		}

		try {
			setLoading(true)
			const { data, success } = await verifyUserByOtp(otpValidator.otpCode(route.params.email, fields), VERBS.POST)			
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

	const onReSend = async () => {
		try {
			const { success } = await verifyAppCode({ email: route.params.email }, VERBS.POST);
			setFields({t1: "",t2: "",t3: "",t4: "",	t5: "",	t6: "",	})
			if (success) {
				if (Platform.OS === 'android') {
					ToastAndroid.show("OTP resend was successful", ToastAndroid.SHORT);
				}
			}
		} catch (e) {
			console.log(e);
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
			<View style={styles.container}>		
			    <Spacer />		
				<RenderHeader />
				<View style={{ ...styles.verticalDivideContainer }}>
				
				</View>
				<View style={{ ...styles.titleContainer }}>
					<Text style={{ ...styles.small_title }}>
						Enter your OTP code here
					</Text>
				</View>				
				<View style={{ ...styles.inputContainer }}>
					<View style={styles.otpBoxContainer}>
						<View style={[styles.otpBox, validationError.t1 && styles.inputError]}>
							<TextInput
								ref={inputRefs[0]}
								value={fields.t1}
								keyboardType="numeric"
								onChangeText={(value) => handleTextChange(value, 0)}
								maxLength={1}
								style={styles.otpInput}
							></TextInput>
						</View>
						<View style={[styles.otpBox, validationError.t2 && styles.inputError]}>
							<TextInput
								ref={inputRefs[1]}
								value={fields.t2}
								keyboardType="numeric"
								onChangeText={(value) => handleTextChange(value, 1)}
								maxLength={1}
								style={styles.otpInput}
							></TextInput>
						</View>
						<View style={[styles.otpBox, validationError.t3 && styles.inputError]}>
							<TextInput
								ref={inputRefs[2]}
								value={fields.t3}
								keyboardType="numeric"
								onChangeText={(value) => handleTextChange(value, 2)}
								maxLength={1}
								style={styles.otpInput}
							></TextInput>
						</View>
						<View style={[styles.otpBox, validationError.t4 && styles.inputError]}>
							<TextInput
								ref={inputRefs[3]}
								value={fields.t4}
								keyboardType="numeric"
								onChangeText={(value) => handleTextChange(value, 3)}
								maxLength={1}
								style={styles.otpInput}
							></TextInput>
						</View>
						<View style={[styles.otpBox, validationError.t5 && styles.inputError]}>
							<TextInput
								ref={inputRefs[4]}
								value={fields.t5}
								keyboardType="numeric"
								onChangeText={(value) => handleTextChange(value, 4)}
								maxLength={1}
								style={styles.otpInput}
							></TextInput>
						</View>
						<View style={[styles.otpBox, validationError.t6 && styles.inputError]}>
							<TextInput
								ref={inputRefs[5]}
								value={fields.t6}
								keyboardType="numeric"
								onChangeText={(value) => handleTextChange(value, 5)}
								maxLength={1}
								style={styles.otpInput}
							></TextInput>
						</View>
					</View>
					<View style={{ ...styles.row }}>
						<TouchableOpacity style={styles.button} onPress={onSubmit}>
							{loading && <ProgressDialog isVisible={loading} />}
							<Text style={styles.buttonText}>Verify</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity style={{ ...styles.descriptionContainer }} onPress={onReSend}>
						<Text
							style={{
								...styles.small_title,
								marginBottom: 1,
								color: MATERIAL_COLORS.grey[600],
								textAlign: "center",
							}}
						>
							Didn't receive the OTP? Resend
						</Text>
					</TouchableOpacity>
				</View>
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
		marginVertical: 20,
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
		backgroundColor: MATERIAL_COLORS.grey[100],
		flex: 1,
	},
	descriptionContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	errorIconContainer: {
		paddingLeft: 10,
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
	inputContainer: {
		flex: 1,
		marginHorizontal: 16
	},
	inputError: {
		borderColor: MATERIAL_COLORS.pink[500],
	},

	otpBox: {
		width: "100%",
		height: 50,
		flex: 1,
		marginHorizontal: 4,
	},
	otpBoxContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
	otpInput: {
		color: "#000",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	
		borderRadius : 8,
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[400],
		borderRadius: 1,
		borderWidth: 1,
		color: MATERIAL_COLORS.grey[900],
		flex: 1,
		fontFamily: FONT_FAMILY.crimson_text_bold,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		
		textAlign: "center"
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
		color: MATERIAL_COLORS.grey[900],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		marginBottom: 20,
	},
	title: {
		fontFamily: FONT_FAMILY.crimson_text_bold,
		fontSize: MATERIAL_FONTS_SIZES.font_size_xxxlarge,
	},
	titleContainer: {
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
		paddingHorizontal: 16,
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

export default CodeVerification;
