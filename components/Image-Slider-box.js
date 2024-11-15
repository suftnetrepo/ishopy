import React from "react";
import {
	View,
	StyleSheet,
	Image
} from "react-native";
import Swiper from 'react-native-swiper';

const ImageSlider = () => {
	
	return (
		<View style={styles.container}>
			<Swiper
				style={styles.wrapper}
				height={350}
				autoplay
				autoplayTimeout={5.5}
				showsButtons={false}
				dotColor="grey"
				activeDotColor="white"
			>
				<View style={styles.slide}>
					<Image
						source={require('../assets/images/image_8.png')}
						style={styles.image}
					/>
				</View>
				<View style={styles.slide}>
					<Image
						source={require('../assets/images/image_6.png')}
						style={styles.image}
					/>
				</View>
				<View style={styles.slide}>
					<Image
						source={require('../assets/images/image_7.png')}
						style={styles.image}
					/>
				</View>			
			</Swiper>
		</View>
	);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
	marginHorizontal : 8,
	marginTop : 8
  },
  image: {
    borderRadius : 8,
	flex: 1,
    resizeMode:'cover',
	width: '100%'	
  },
  slide: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {}
});

export default ImageSlider;
