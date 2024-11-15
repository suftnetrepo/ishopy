/* eslint-disable react-native/no-unused-styles */
import React from "react";
import {
	View,
	StyleSheet,
} from "react-native";
import ProductInfo from '../product/productInfo'
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from "../../constants";

const ProductProfile = ({ product, navigation }) => {
	return (
		<View style={styles.container}>
			<ProductInfo
				product={product}
				navigation={navigation}
			/>			
		</View>	);
};

const styles = StyleSheet.create({
	activeButtonBg: {
		backgroundColor: MATERIAL_COLORS.indigo[700],
	},
	activeButtonColor: {
		backgroundColor: MATERIAL_COLORS.grey[1],
	},
	button: {
		backgroundColor: MATERIAL_COLORS.cyan[1500],
		borderColor: MATERIAL_COLORS.grey[1],
		borderRadius: 30,
		borderWidth: 1,
		marginLeft: 1,
		paddingHorizontal: 15,
		paddingVertical: 5,
	},
	buttonContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
	},
	buttonText: {
		color: MATERIAL_COLORS.grey[1],
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
	},
	container: {
		flex: 1,
	}	
});

export default ProductProfile;
