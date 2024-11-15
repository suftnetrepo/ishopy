/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	ImageBackground,
	Dimensions,
	ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES, FONT_FAMILY } from '../../constants';
import { formatCurrency } from '../../util/helpers';
import { useAppContext } from '../hooks/AppContext';
import AddItemToCart from '../AddItemToCart';

const { width } = Dimensions.get('window');

const ProductInfo = ({ product, navigation }) => {
	const { seller } = useAppContext()
	const {		
		name,
		unit,
		price,
		offer_price,
		description,
	} = product;
	const currency = seller.currency || ""
	  
	const RenderHeader = () => (
		<View style={styles.header}>
			<View style={styles.iconContainer}>
				<Icon
					name="arrow-left"
					size={30}
					color={MATERIAL_COLORS.grey[1]}
					onPress={() => navigation.goBack()}
				/>
			</View>
			<View style={{ flex: 1 }} />
		</View>
	);
	return (
		<View style={styles.container}>
			{product.secure_url ? (
				<ImageBackground
					style={styles.image}
					source={{
						uri: product.secure_url,
					}}
					resizeMode="cover">
					<RenderHeader />
				</ImageBackground>
			) : (
				<ImageBackground
					style={styles.image}
					source={require('../../assets/images/no_image.png')}
					resizeMode="cover">
					<RenderHeader />
				</ImageBackground>
			)}
			<View style={{ marginVertical: 8 }}></View>
			<ScrollView showsVerticalScrollIndicator={false} style={styles.containerScroll}>
				<View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginHorizontal: 16, marginBottom: 8 }}>
					<Text style={styles.title}>{name}</Text>
					{
						unit && (
							<Text style={styles.unit}>Unit {unit}</Text>
						)
					}
				</View>				
				<View style={{ ...styles.rowContainer, marginHorizontal: 16 }}>
					{
						offer_price > 0 ? (
							<View style={{ ...styles.columnContainer, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
								<Text style={styles.text}>{formatCurrency(currency, offer_price)}</Text>
								<Text style={{ ...styles.price, fontWeight: '600', textDecorationLine: 'line-through', color: MATERIAL_COLORS.grey[700] }}>{formatCurrency(currency, price)}</Text>
							</View>
						) : (
							<Text style={styles.text}>{formatCurrency(currency, price)}</Text>
						)
					}
					<AddItemToCart item={product} />
				</View>
				<View style={{ marginVertical: 4 }}></View>
				<View style={styles.descriptionContainer}>
					<Text style={styles.description}>{description}</Text>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	   columnContainer: {
       alignItems: 'center',
       flexDirection: 'column',
       justifyContent: 'center',
    },
	container: {
		backgroundColor: MATERIAL_COLORS.grey[1]
	},
	containerScroll: {
		flex: 1,
		paddingBottom: 90
	},
	description: {
		color: MATERIAL_COLORS.grey[700],
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_medium,

	},
	descriptionContainer: {
		marginHorizontal: 16
	},
	descriptionTitle: {
		color: MATERIAL_COLORS.grey[700],
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		fontWeight: 'bold',
		marginBottom: 1,
		marginHorizontal: 16,
		marginTop: 4
	},
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		height: 56,
		justifyContent: 'flex-start',
		marginTop: 20,
		paddingHorizontal: 20,
		paddingVertical: 8,
	},
	headerText: {
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
		marginHorizontal: 8,
	},
	iconContainer: {
		alignItems: 'center',
		backgroundColor: MATERIAL_COLORS.grey[800],
		borderColor: MATERIAL_COLORS.grey[500],
		borderRadius: 24,
		borderWidth: 1,
		flexDirection: 'column',
		height: 48,
		justifyContent: 'center',
		marginTop: 8,
		width: 48
	},
	image: {
		height: 350,
		width: width,
	},
	mobile: {
		color: MATERIAL_COLORS.grey[700],
		fontSize: MATERIAL_FONTS_SIZES.f,
		marginBottom: 1,
	},
	rowContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	text: {
		color: MATERIAL_COLORS.green[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		fontWeight:'bold'
	},
	title: {
		color: MATERIAL_COLORS.grey[700],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		fontWeight: 'bold'
	},
	topCampaignsTitle: {
		color: MATERIAL_COLORS.grey[700],
		fontFamily: FONT_FAMILY.crimson_text,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
	},
	unit: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal
	},
});

export default ProductInfo;
