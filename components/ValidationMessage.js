import React from "react";
import { Text, View } from "react-native";
import { FONT_FAMILY, MATERIAL_COLORS } from "../constants";

const ValidationMessage = ({ message }) => {
	return (
		<View style={styles.container}>
			<Text style={{...styles.text}}>{message}</Text>
		</View>
	);
};

const styles = {
	container: {
		marginLeft: 8,
	},
	text: {
		fontSize: 16,
		fontFamily: FONT_FAMILY.crimson_text,
		color: MATERIAL_COLORS.red[800],
	},
};

export default ValidationMessage;
