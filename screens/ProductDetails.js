import React from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	StatusBar,
	View,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	MATERIAL_COLORS,
	MATERIAL_FONTS_SIZES,
} from "../constants";
import ProductProfile from "../components/product/productProfile";

const ProductDetails = ({ navigation, route }) => {
	return (
		<SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
			<StatusBar translucent backgroundColor='transparent' />
			<View style={styles.wrapper}>
				<ProductProfile product={route.params.product} navigation={navigation} />

				<View
					onPress={() => navigation.goBack()}
					style={{ ...styles.continueContainer }}
				>
					<View style={{ ...styles.rowContainer, justifyContent: 'space-between', marginHorizontal: 20 }}>
						<TouchableOpacity onPress={() => navigation.navigate("shopping-cart")} style={{ ...styles.columnContainer, width: 'auto', flex: 1 }}>
							<Icon
								name="cart"
								size={40}
								color={MATERIAL_COLORS.grey[800]}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={{ ...styles.continue, width: 0, flex: 3 }} onPress={() => navigation.goBack()}>
							<View style={styles.rowContainer}>
								<Icon
									name="shopping"
									size={25}
									color={MATERIAL_COLORS.grey[1]}
								/>
								<Text style={{...styles.text, marginLeft : 8 }} >Continue Shopping</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	columnContainer: {
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center"
	},
	container: {
		backgroundColor: MATERIAL_COLORS.grey[1],
		flex: 1,
		position: "relative",
	},
	continue: {
		backgroundColor: MATERIAL_COLORS.cyan[500],
		borderColor: MATERIAL_COLORS.cyan[500],
		borderRadius: 30,
		borderWidth: 1,
		paddingHorizontal: 20,
		paddingVertical: 10,
		width: "90%",
	},
	continueContainer: {
		alignItems: "center",
		bottom: 8,
		flexDirection: "column",
		justifyContent: "center",
		position: "absolute",
		width: "100%",
	},
	rowContainer: {
		alignItems: "center",
		flexDirection: 'row',
		justifyContent: 'center'
	},
	text: {
		color: MATERIAL_COLORS.grey[1],
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		textAlign: "center",
	},
	wrapper: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'space-between',
		paddingBottom: 58

	}
});

export default ProductDetails;
