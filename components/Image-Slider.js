import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Image,
} from "react-native";
import { FONT_FAMILY, MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from "../constants";
import { SLIDERS } from "../assets/data/sliders";

const { width } = Dimensions.get("window");

const CARD_WIDTH = width - 20;
const CARD_HEIGHT = 200;
const CARD_WIDTH_SPACING = CARD_WIDTH + 10;

const Slider = () => {
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);	
	const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
		setCurrentSlideIndex(viewableItems[0].index);
	});

	const viewabilityConfig = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

	return (
		<View style={styles.container}>
			<FlatList
				data={SLIDERS}
				horizontal
				snapToInterval={CARD_WIDTH_SPACING}
				decelerationRate="fast"
				showsHorizontalScrollIndicator={false}
				keyExtractor={(item, index) => index.toString()}
				contentContainerStyle={{ paddingHorizontal: 10 }}
				onViewableItemsChanged={onViewableItemsChanged.current}
				viewabilityConfig={viewabilityConfig.current}
				renderItem={({ item, index }) => {
					return (
						<TouchableOpacity key={index} style={{ marginRight: 10 }}>
							<View style={styles.card}>
								<View style={styles.imageBox}>
									<Image
										source={item.image}
										resizeMode="contain"
										style={styles.image}
									/>
									<View style={styles.overlay} />
								</View>
								{/* <View style={styles.titleBox}>
									<Text style={styles.title}>{item.title}</Text>
									<Text style={styles.description}>{(item.message || item.description)}</Text>
								</View> */}
							</View>
						</TouchableOpacity>
					);
				}}
			/>
			<View style={styles.indicatorContainer}>
				{SLIDERS.map((_, i) => (
					<Text key={i} style={{ color: i === currentSlideIndex ? MATERIAL_COLORS.grey[1] : MATERIAL_COLORS.grey[400], fontSize: 60 }}>•</Text>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		height: CARD_HEIGHT,
		marginVertical: 8,
		position: "relative",
		width: CARD_WIDTH,
	},
	container: {
		flex: 1,
	},
	description: {
		color: MATERIAL_COLORS.grey[1],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_normal
	},
	image: {
		height: CARD_HEIGHT,
		resizeMode: "cover",
		width: CARD_WIDTH,
	},
	imageBox: {
		borderRadius: 10,
		height: CARD_HEIGHT,
		overflow: "hidden",
		width: CARD_WIDTH,
	},
	indicatorContainer: {
		alignItems: 'center',
		bottom: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		left: 0,
		position: 'absolute',
		right: 0,
	},
	overlay: {
		backgroundColor: "rgba(0,0,0,0.1)",
		height: CARD_HEIGHT,
		left: 0,
		position: "absolute",
		top: 0,
		width: CARD_WIDTH,
	},
	title: {
		color: MATERIAL_COLORS.grey[1],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_large,
		fontWeight: "bold"
	},
	titleBox: {
		left: 16,
		position: "absolute",
		top: CARD_HEIGHT - 180,
		width: CARD_WIDTH / 1.5,

	}
});

export default Slider;
