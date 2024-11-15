import React, { useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native";
import {
	FONT_FAMILY,
	MATERIAL_COLORS,
	MATERIAL_FONTS_SIZES,
} from "../constants";

const Category = ({ navigation, categories = [] }) => {
	const [expandedCardIndex, setExpandedCardIndex] = useState(null);

	const handleCategoryProducts = async (category) => {
		navigation.navigate("products", {
			category
		});
	};

	const toggleCardExpansion = (index) => {
		setExpandedCardIndex(expandedCardIndex === index ? null : index);
	};

	const Card = ({ category, isExpanded, toggleExpansion }) => {
		return (
			<View>
				<TouchableOpacity
					style={styles.cardContainer}
					onPress={() => {
						toggleExpansion()
						handleCategoryProducts(category);
					}}
				>
					<Text
						style={{
							fontSize: MATERIAL_FONTS_SIZES.font_size_large,
							fontFamily: FONT_FAMILY.crimson_text_regular,
							...styles.cardButton,
							backgroundColor: isExpanded
								? MATERIAL_COLORS.purple[800]
								: MATERIAL_COLORS.grey[1],
							color: isExpanded
								? MATERIAL_COLORS.grey[100]
								: MATERIAL_COLORS.grey[800],
						}}
					>
						{category.name}
					</Text>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			{
				categories.length > 0 && (
					<View>

						<View style={styles.textContainer}>
							<Text style={{ ...styles.title, ...styles.border_Container }}>Shop by Categories</Text>
							<TouchableOpacity
								onPress={() => navigation.navigate("categories")}
							>
								<Text style={styles.seeAll}>See all</Text>
							</TouchableOpacity>
						</View>
						<View style={{ marginHorizontal: 8 }}>
							<FlatList
								horizontal
								keyExtractor={(item) => item._id}
								showsHorizontalScrollIndicator={false}
								data={categories}
								renderItem={({ item, index }) => {
									return (
										<Card
											key={index}
											category={item}
											isExpanded={expandedCardIndex === index}
											toggleExpansion={() => toggleCardExpansion(index)}
										/>
									);
								}}
							/>
						</View>
					</View>
				)
			}
		</View>
	);
};

const styles = StyleSheet.create({
	border_Container: {
		borderColor: MATERIAL_COLORS.grey[200],
		borderRadius: 30,
		borderWidth: 1,
		paddingHorizontal: 16
	},
	cardButton: {
		borderColor: MATERIAL_COLORS.grey[600],
		borderRadius: 30,
		borderWidth: 1,
		marginRight: 8,
		paddingHorizontal: 20,
		paddingVertical: 6
	},
	cardContainer: {
		marginVertical: 8,
	},
	container: {
		flexDirection: "column",
		justifyContent: "flex-start",
	},
	seeAll: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
	},
	text: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
	},
	textContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingRight: 16
	},
	title: {
		color: MATERIAL_COLORS.grey[700],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
	},
});

export default Category;
