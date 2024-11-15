/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,  
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES, MATERIAL_SPACING, FONT_FAMILY } from "../constants";
import { useAppContext } from "../components/hooks/AppContext";
import Spacer from "../components/Spacer";

const screenWidth = Dimensions.get('window').width;

const Categories = ({ navigation }) => {
  const { categories = [] } = useAppContext()

  const handleCategoryProducts = async (category) => {
		navigation.navigate("products", {
			category
		});
	};

  const RenderHeader = () => (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Icon
          name="arrow-left"
          size={30}
          color={MATERIAL_COLORS.grey[700]}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text
        style={{
          color: MATERIAL_COLORS.grey[700],
          fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
          marginLeft: 8
        }}
      >
        Categories
      </Text>
      <View style={{ flex: 1 }} />
    </View>
  )

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleCategoryProducts(item)}>     
      {item?.secure_url ? (
        <Image
          style={styles.image}
          source={{
            uri: item.secure_url,
          }}
        >
        </Image>
      ) : (
        <Image
          style={styles.image}
          source={require('../assets/images/no_image.png')}
        >
        </Image>
      )}
      <Text style={styles.name}>{item.name}</Text>   

    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>  
      <Spacer /> 
      <RenderHeader />     
      <View style={{ flex: 1, paddingHorizontal: 8, marginTop: 8, backgroundColor: MATERIAL_COLORS.grey[200] }}>
        <FlatList
          decelerationRate={"fast"}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          data={categories}
          onEndReachedThreshold={0.5}
          renderItem={renderItem}        
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation :2,
    flexDirection: 'column',
    height: 200,
    justifyContent: 'center',
    margin: 8,
    padding: 10,
    width: screenWidth / 2 - 30
  },
  container: {
    backgroundColor: MATERIAL_COLORS.grey[100],
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: MATERIAL_COLORS.grey[1],
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: MATERIAL_SPACING.spacing_medium_14,
    paddingVertical: 8
  },
  headerText: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  iconContainer: {
    alignItems: 'center',
    borderColor: MATERIAL_COLORS.grey[500],
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'column',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  image: {
    height: 150,
    marginHorizontal: 4,   
    resizeMode: 'contain',
    width: '100%'
  },
  infoContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  
  listContainer: {
    paddingHorizontal: 10,
  },
  name: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text,
    fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
    marginBottom : 8,
    paddingHorizontal: 8,
    textAlign: 'center'
  },    
  title: {
    color: MATERIAL_COLORS.grey[700],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
 
});

export default Categories;
