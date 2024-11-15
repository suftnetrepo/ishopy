import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from "../constants";

const SellerBasicInfo = ({ secure_url, fullName, completeAddress, mobile, email }) => {
	return (
		<View style={styles.container}>
			{secure_url ? (
				<Image
					style={styles.image}
					source={{
						uri: secure_url,
					}}
					resizeMode="cover"
				/>
			) : (
				<Image
					style={styles.image}
					source={require("../assets/images/no_image.png")}
					resizeMode="cover"
				/>
			)}

			<Text style={styles.fullName}>{fullName}</Text>		
			<Text style={styles.email}>{email}</Text>	
			<Text style={styles.mobile}>{mobile}</Text>		
			<Text style={styles.completeAddress}>{completeAddress}</Text>	
		</View>
	);
};

const styles = StyleSheet.create({
	completeAddress: {
		color: MATERIAL_COLORS.grey[800],
		fontSize: MATERIAL_FONTS_SIZES.font_size_small,	
		marginBottom: 1,
		textAlign: 'center'
	},
	container: {
		alignItems: "center",
		backgroundColor : MATERIAL_COLORS.grey[100],	
		padding: 16
	},
	email: {
		color: MATERIAL_COLORS.grey[800],
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,	
		marginBottom: 1,
	},	
	fullName: {
		color: MATERIAL_COLORS.grey[800],
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		fontWeight: "bold",
		marginBottom: 1,
		textAlign: 'center'
	},
	image: {
		borderRadius: 60,
		height: 120,
		marginBottom : 16,
		width: 120
	},
	mobile: {
		color: MATERIAL_COLORS.grey[800],
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,	
		marginBottom: 1,
	},
});

export default SellerBasicInfo;
