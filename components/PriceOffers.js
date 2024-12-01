/* eslint-disable react-native/no-unused-styles */
import React, { useEffect, useReducer } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
	ScrollView,
} from "react-native";
import {
	StyledCycle,
  } from 'fluent-styles';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES, FONT_FAMILY, VERBS } from "../constants";
import { useAppContext } from "../components/hooks/AppContext";
import { fetchItemByPriceOffers } from '../api';
import { formatCurrency } from "../util/helpers"
import { theme } from "../util/theme";
import { useCart } from "./hooks/CartProvider";

const { width } = Dimensions.get("window");

const initialState = {
	products: [],
	loading: false,
	pageInfo: 0,
};

function reducer(state, action) {
	switch (action.type) {
		case "START_LOADING":
			return { ...state, loading: true };
		case "FINISH_LOADING":
			return { ...state, loading: false };
		case "SET_PRODUCTS":
			return { ...state, products: action.payload };
		case "SET_PAGE_INFO":
			return { ...state, pageInfo: action.payload };
		default:
			return state;
	}
}

const PriceOffers = ({ navigation }) => {
	const { seller } = useAppContext()
	const {addToCart} = useCart();
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(() => {
		const fetchAndLoadPriceOffers = async () => {
			try {
				dispatch({ type: "START_LOADING" });
				const queryParams = {
					suid: seller._id,
					page: 1,
					limit: 10,
				};
				const { data, success } = await fetchItemByPriceOffers(null, VERBS.GET, null, queryParams);

				if (success) {
					dispatch({ type: "SET_PRODUCTS", payload: data.items });

					if (state.pageInfo !== data.total) {
						dispatch({ type: "SET_PAGE_INFO", payload: data.total });
					}
				}

			} catch (error) {
				console.error("Error fetching products:", error);
			} finally {
				dispatch({ type: "FINISH_LOADING" });
			}
		};

		fetchAndLoadPriceOffers();
	}, [seller]);


	const handleSelectProduct = async (product) => {
		navigation.navigate("product-details", {
			product
		});
	};

	const handleAddToCart = async item => {
		item.isAdded = true;
		await addToCart(item);
	  };

	if (state?.products?.length === 0) {
		return null
	}

	const Card = ({ item }) => {
		const { name, unit, offer_price = 0, price = 0 } = item
		return (
			<TouchableOpacity
				style={[styles.itemContainer]}
				onPress={() => {
					handleSelectProduct(item);
				}}
			>
				<View style={styles.imageContainer}>
					{item?.secure_url ? (
						<Image
							style={styles.image}
							source={{
								uri: item?.secure_url,
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
				</View>

				<View style={{ ...styles.itemInfoContainer, flex: 1 }}>
					<View style={styles.columnContainer}>
						<Text style={styles.itemInfoName}>
							{name}
						</Text>
						<View style={{ marginVertical: 2 }}></View>
						<Text style={styles.name}>Unit {unit}</Text>
					</View>
					<View style={{ marginVertical: 2 }}></View>

					<View style={{ ...styles.rowContainer }}>
						<Text style={styles.price}>{formatCurrency(seller.currency || "", offer_price)}</Text>
						<Text style={{ ...styles.price, marginLeft: 8, fontWeight: '600', textDecorationLine: 'line-through', color: MATERIAL_COLORS.grey[800] }}>
							{formatCurrency(seller.currency, price)}
						</Text>
					</View>
				</View>

				<View style={{ ...styles.rowContainer, justifyContent: 'flex-end', marginRight: 16, marginTop: 8 }}>
					<StyledCycle
						borderWidth={1}
						height={48}
						width={48}
						backgroundColor={theme.colors.gray[1]}>
						<Icon
							size={48}
							name={'plus-circle'}
							color={theme.colors.green[600]}
							onPress={() => handleAddToCart(item)}
						/>
					</StyledCycle>
				</View>

			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.topItemsTextContainer}>
				<Text style={{ ...styles.topItemsTitle }}>Special Offer</Text>
				<TouchableOpacity
					onPress={() => navigation.navigate("product-price-offers")}
				>
					<Text style={styles.topItemSeeAll}>View all</Text>
				</TouchableOpacity>
			</View>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{
					state?.products?.map((proudct, index) => {
						return (
							<Card
								key={`${proudct._id}-${index}`}
								item={proudct}
							/>
						)
					})
				}
			</ScrollView>

		</View>
	);
};

const styles = StyleSheet.create({
	border_Container: {
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[700],
		borderRadius: 30,
		borderWidth: 1,
		paddingHorizontal: 16
	},
	itemContainer: {
		width: width - 16,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: 'flex-start',
		backgroundColor: MATERIAL_COLORS.grey[1],
		borderColor: MATERIAL_COLORS.grey[1],
		borderRadius: 16,
		borderWidth: 0.5,
		marginRight: 8
	},
	itemInfoContainer: {
		alignItems: "flex-start",
		flexDirection: "column",
		justifyContent: "flex-start",

	},
	itemInfoName: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal
	},
	container: {
		paddingHorizontal: 2,
		marginHorizontal: 8,
		marginBottom: 8
	},
	image: {
		borderRadius: 8,
		height: 80,
		width: 80,
		margin: 8
	},
	imageContainer: {
		marginHorizontal: 4,
		paddingVertical: 4,
	},
	rowContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: 'flex-start',
	},
	columnContainer: {
		alignItems: "flex-start",
		flexDirection: "column",
		justifyContent: 'flex-start',
	},
	text: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
	},
	topItemSeeAll: {
		color: MATERIAL_COLORS.green[700],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_small,
	},
	topItemsTextContainer: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	topItemsTitle: {
		color: MATERIAL_COLORS.grey[500],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
	},
	price: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		fontWeight: 'none'
	},
});

export default PriceOffers;
