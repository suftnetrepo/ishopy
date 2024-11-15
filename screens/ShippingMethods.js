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
import { formatCurrency } from '../util/helpers';
import { useAppContext } from "../components/hooks/AppContext";
import Spacer from "../components/Spacer";

const ShippingMethods = ({ navigation, route }) => {
	const { seller: { shipping_methods, currency } } = useAppContext()
	const [selectedShippingMethod, setSelectedShippingMethod] = useState({});
	
	const handleContinue = () => {
		if (selectedShippingMethod && Object.keys(selectedShippingMethod).length === 0) return
		navigation.navigate("payment-method", {
			...route.params,
			shippingMethod: selectedShippingMethod
		});
	};

	const Card = ({ shippingMethod }) => {
		const handleCardPress = () => {
			setSelectedShippingMethod(shippingMethod)
		};

		return (
			<TouchableOpacity style={[styles.cardContainer, { borderColor: (selectedShippingMethod._id === shippingMethod._id) ? MATERIAL_COLORS.green[800] : MATERIAL_COLORS.grey[100] }]} onPress={handleCardPress}>
				<View style={{ ...styles.rowContainer, justifyContent: 'space-between' }}>
					<View style={styles.rowContainer}>
						<Text style={styles.name}>{shippingMethod.name}</Text>
					</View>
					<Text style={styles.price}>{formatCurrency(currency, shippingMethod.deliveryCharges)}</Text>
				</View>
				<View>
					<Text style={styles.description}>{shippingMethod.description}</Text>
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
				<Text style={styles.headerText}>Shipping Methods</Text>
				<View style={{ flex: 1 }} />
			</View>
			<FlatList
				decelerationRate={0.8}
				keyExtractor={(item) => item._id}
				showsVerticalScrollIndicator={false}
				data={shipping_methods.filter(x => x.active === true)}
				renderItem={({ item }) => {
					return <Card key={item._id} shippingMethod={item} />;
				}}
				ListFooterComponent={() => <View style={{ height: 56 }} />}
			/>
			{
			Object.keys(selectedShippingMethod).length > 0 && (
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
		backgroundColor: MATERIAL_COLORS.cyan[500],
		borderColor: MATERIAL_COLORS.cyan[500],
		borderRadius: 30,
		borderWidth: 1,
		paddingHorizontal: 20,
		paddingVertical: 10,
		width: "90%",
	},
	description: {
		color: MATERIAL_COLORS.grey[700],
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal
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
		fontFamily: FONT_FAMILY.crimson_text_bold,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large
	},
	price: {
		color: MATERIAL_COLORS.cyan[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
		fontWeight: 'bold'
	},
	rowContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "flex-start",
	},
});

export default ShippingMethods;
