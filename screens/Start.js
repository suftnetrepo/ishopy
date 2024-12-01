import React from "react";
import { View, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import MIcon from "react-native-vector-icons/MaterialIcons";
import {
	MATERIAL_COLORS,
	MATERIAL_FONTS_SIZES,
	FONT_FAMILY,
} from "../constants";
import { useAppContext } from "../components/hooks/AppContext";
import ProgressDialog from "../components/ProgressDialog";
import ProductList from "../components/ProductList";
import NotifyCart from "../components/NotifyCart";
import Spacer from "../components/Spacer";
import OutOfDeliveryRangeMessage from "../components/OutOfDeliveryRangeMessage";
import PriceOffers from "../components/PriceOffers";
import { StyledBackgroundImage, StyledSpacer, YStack, XStack, StyledText, FlexStyledImage } from 'fluent-styles';
import { fontStyles } from "../util/fontStyles";
import { theme } from "../util/theme";
import { ensureHttps, formatAddress } from "../util/helpers";
import { useCatalogue } from "../components/hooks/useCatalogue";
import CategoryScrollView from "../components/package/category";
import MyCurrentLocation from "../components/MyCurrentLocation";

const Start = ({ navigation }) => {
	const { seller } = useAppContext()
	const { data, loading } = useCatalogue(seller._id)

	return (
		<SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
			<Spacer />
			<View style={[styles.container, styles.backgroundColor]}>
				<View style={styles.header}>
					<FlexStyledImage
						local={true}
						height={50}
						width={50}
						borderColor={theme.colors.gray[1]}
						imageUrl={require("../assets/images/icons8-shopper-100.png")}
					/>
					<View style={{ marginHorizontal: 2 }} />
					<MyCurrentLocation />
					<View style={{ flex: 1 }} />
					<View style={styles.notifyContainer}>
						<NotifyCart navigation={navigation} />
					</View>
				</View>
			</View>
			<StyledBackgroundImage
				local={false}
				height={200}
				borderWidth={0}
				width={'100%'}
				imageUrl={ensureHttps(seller?.secure_url)}
			>
				<YStack flex={1} justifyContent='flex-start' alignItems='flex-start' backgroundColor={theme.colors.transparent05} >
					<YStack flex={1} justifyContent='flex-end' alignItems='flex-end' >
						<YStack paddingHorizontal={16} paddingVertical={8}>
							<StyledText
								fontFamily={fontStyles.Roboto_Regular}
								fontWeight={theme.fontWeight.bold}
								color={theme.colors.gray[50]}
								fontSize={theme.fontSize.xxlarge}
							>
								{seller?.name}
							</StyledText>
							<XStack width={'100%'} justifyContent='flex-start'
								paddingVertical={2}
								alignItems='center'>
								<MIcon
									name="location-pin"
									size={32}
									color={theme.colors.gray[1]}
								/>
								<StyledSpacer marginHorizontal={2} />
								<StyledText
									flex={1}
									fontFamily={fontStyles.Roboto_Regular}
									fontWeight={theme.fontWeight.normal}
									color={theme.colors.gray[50]}
									fontSize={theme.fontSize.medium}
								>
									{formatAddress(seller?.address)}
								</StyledText>
							</XStack>
						</YStack>
					</YStack>
				</YStack>
			</StyledBackgroundImage>
			<ScrollView showsVerticalScrollIndicator={false} >
				<View style={{ ...styles.labelContainer }}>
					<CategoryScrollView onPress={(category) => {
						navigation.navigate("products", {
							category
						})
					}} categories={data?.categories} />
				</View>
				
				<View style={{ ...styles.labelContainer, marginTop: 8 }}>
					<PriceOffers navigation={navigation} />
				</View>
				<View style={{ ...styles.labelContainer, marginTop: 8 }}>
					<ProductList navigation={navigation} products={data?.products} />
				</View>

			</ScrollView>
			{loading && <ProgressDialog isVisible={loading} />}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	backgroundColor: {
		backgroundColor: "#ffffff",
	},
	container: {
		flexDirection: "column",
		paddingHorizontal: 10,
	},
	greeting: {
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
	},
	header: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 8
	},
	labelContainer: {
		marginTop: 8,

	},
	notifyContainer: {
		alignItems: "center",
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	panelHandle: {
		backgroundColor: MATERIAL_COLORS.brown[600],
		borderRadius: 4,
		height: 4,
		width: 80,
	},
	panelHeader: {
		alignItems: "center",
	},
	row: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between'

	},
	sellerName: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_xxlarge
	},
	sliderContainer: {
		height: 210,
		marginVertical: 2,
	},
	title: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal
	},
	userContainer: {
		alignItems: "flex-start",
		flexDirection: 'column',
		justifyContent: 'flex-start'
	}
});

export default Start;
