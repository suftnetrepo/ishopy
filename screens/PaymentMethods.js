import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	FlatList,
	TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
	FONT_FAMILY,
	MATERIAL_COLORS,
	MATERIAL_FONTS_SIZES,
} from "../constants";
import { useAppContext } from "../components/hooks/AppContext";
import { formatPaymentMethodName } from '../util/helpers';
import Spacer from "../components/Spacer";

const PaymentMethods = ({ navigation, route }) => {
	const { seller: { delivery_payment_provider } } = useAppContext()
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});

	const handleContinue = () => {
		if (Object.keys(selectedPaymentMethod).length === 0) return
		navigation.navigate("checkout", {
			...route.params,
			paymentMethod: selectedPaymentMethod
		});
	};
	
	const Card = ({ paymentMethod }) => {
		const handleCardPress = () => {
			setSelectedPaymentMethod(paymentMethod)
		};

		return (
			<TouchableOpacity style={[styles.cardContainer, { borderColor: (selectedPaymentMethod._id === paymentMethod._id) ? MATERIAL_COLORS.green[800] : MATERIAL_COLORS.grey[100] }]} onPress={handleCardPress}>
				<View style={{ ...styles.rowContainer, justifyContent: 'space-between' }}>
					<View style={styles.rowContainer}>
						{
							(paymentMethod.name === "CashOnDelivery") ? (<Icon
								name="cash"
								size={30}
								color={MATERIAL_COLORS.grey[800]}
							/>) : (paymentMethod.name === "Stripe") && (
								<Icon
									name="credit-card"
									size={30}
									color={MATERIAL_COLORS.grey[800]}
								/>
							)
						}
						<Text style={styles.name}>{formatPaymentMethodName(paymentMethod.name)}</Text>
					</View>
					{
						(selectedPaymentMethod._id === paymentMethod._id) && (
							<Icon
								name="check-circle-outline"
								size={30}
								color={MATERIAL_COLORS.green[800]}
							/>
						)
					}

				</View>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView style={styles.container}>	
		<Spacer />		
			<View style={styles.header}>
				<View style={styles.iconContainer}>
					<Icon
						name="arrow-left"
						size={30}
						color={MATERIAL_COLORS.white}
						onPress={() => navigation.goBack()}
					/>
				</View>
				<Text style={styles.headerText}>Payment Methods</Text>
				<View style={{ flex: 1 }} />
			</View>
			<FlatList
				decelerationRate={0.8}
				keyExtractor={(item) => item._id}
				showsVerticalScrollIndicator={false}
				// data={delivery_payment_provider.filter(x => x.active === true)}
				data={delivery_payment_provider.filter(x => x.name !== "PayPal")}
				renderItem={({ item }) => {
					return <Card key={item._id} paymentMethod={item} />;
				}}
				ListFooterComponent={() => <View style={{ height: 56 }} />}
			/>
			{
				Object.keys(selectedPaymentMethod).length > 0 && (
					<TouchableOpacity
						onPress={() => handleContinue()}
						style={styles.continue}
					>
						<Text style={styles.continue}>Next</Text>
					</TouchableOpacity>
				)
			}

		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	cardContainer: {
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[100],
		borderRadius: 8,
		borderWidth: 1,
		elevation: 2,
		marginBottom: 8,
		marginHorizontal: 8,
		padding: 16
	},
	container: {
		backgroundColor: MATERIAL_COLORS.grey[100],
		flex: 1,
		position: "relative",
	},
	continue: {
		backgroundColor: MATERIAL_COLORS.cyan[500],
		borderColor: MATERIAL_COLORS.cyan[500],
		borderRadius: 30,
		borderWidth: 1,
		color: MATERIAL_COLORS.grey[1],
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		fontWeight: "bold",
		paddingHorizontal: 20,
		paddingVertical: 5,
		textAlign: "center",
		width: "95%",
		marginHorizontal:10
	},
	continueContainer: {
		alignItems: "center",
		bottom: 8,
		flexDirection: "column",
		justifyContent: "center",
		position: "absolute",
		width: "100%",
	},
	header: {
		alignItems: "center",
		backgroundColor: MATERIAL_COLORS.grey[1],
		flexDirection: "row",
		height: 56,
		justifyContent: "flex-start",
		marginBottom: 8,
		paddingHorizontal: 20,
		paddingVertical: 8
	},
	headerText: {
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		marginHorizontal: 8,
	},
	iconContainer: {
		alignItems: "center",
		borderColor: MATERIAL_COLORS.grey[500],
		borderRadius: 24,
		borderWidth: 1,
		flexDirection: "column",
		height: 48,
		justifyContent: "center",
		width: 48,
	},
	name: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		marginLeft: 4
	},
	rowContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "flex-start",
	},
});

export default PaymentMethods;
