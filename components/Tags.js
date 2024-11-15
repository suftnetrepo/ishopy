import React, { useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import {
	FONT_FAMILY,
	MATERIAL_COLORS,
	MATERIAL_FONTS_SIZES,
	TAGS
} from "../constants";

const Tags = ({ handleFilterSellers }) => {
	const [selectedValues, setSelectedValues] = useState([]);
	
	const toggleValue = (value) => {
		setSelectedValues((prevSelected) =>
			prevSelected.includes(value)
				? prevSelected.filter((item) => item !== value)
				: [...prevSelected, value]
		);
		handleFilterSellers(selectedValues)		
	};

	const isValueSelected = (value) => selectedValues.includes(value);
	const Card = ({ tag, index }) => {
		return (
			<TouchableOpacity
				key={index}
				style={[styles.cardContainer, styles.cardButton, isValueSelected(tag) && styles.selectedButton]}
				onPress={() => {
					toggleValue(tag)
				}}

			>
				<Text style={[styles.buttonText, isValueSelected(tag) && styles.selectedText]}>{tag}</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			{
				TAGS.map((tag, index) => (
					<Card
						key={index}
						tag={tag}						
					/>
				))
			}

		</View>
	);
};

const styles = StyleSheet.create({
	buttonText: {
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
	},
	cardButton: {
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[800],
		borderRadius: 30,
		borderWidth: 1,
		marginRight: 8,
		paddingHorizontal: 20,
		paddingVertical: 5
	},
	cardContainer: {
		marginVertical: 8,
	},
	container: {
		alignItems: 'center',
		flexDirection: "row",
		flexWrap: 'wrap',
		justifyContent: "center",
		marginHorizontal: 8,
		marginVertical: 8
	},
	selectedButton: {
		backgroundColor: MATERIAL_COLORS.purple[800],
	},
	selectedText: {
		color: MATERIAL_COLORS.grey[100]
	}
});

export default Tags;
