/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  XStack,
  StyledText,
  StyledButton,
  StyledCycle,
  StyledSpacer,
} from 'fluent-styles';
import Ionicons from "react-native-vector-icons/Ionicons";
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES, MATERIAL_SPACING, FONT_FAMILY, VERBS } from "../constants";
import { useAppContext } from "../components/hooks/AppContext";
import { fetchItemByPriceOffers, fetchProducts } from '../api';
import { formatCurrency } from "../util/helpers";
import { useCart } from "../components/hooks/CartProvider";
import NotifyCart from "../components/NotifyCart";
import Spacer from "../components/Spacer";
import { theme } from '../util/theme';

const screenWidth = Dimensions.get('window').width;

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
    case "APPEND_PRODUCTS":
      return { ...state, products: [...state.products, ...action.payload] };
    case "SET_PAGE_INFO":
      return { ...state, pageInfo: action.payload };
    default:
      return state;
  }
}

const ProductPriceOffers = ({ navigation, route }) => {
  const { seller } = useAppContext()
  const { addToCart } = useCart()
  const [currentPage, setCurrentPage] = useState(1);
  const [state, dispatch] = useReducer(reducer, initialState);
  const category = route.params?.category

  useEffect(() => {
    const fetchAndLoadProducts = async () => {
      try {
        dispatch({ type: "START_LOADING" });
        const queryParams = {
          suid: seller._id,
          page: currentPage,
          limit: 10
        };
        const { data, success } = await fetchItemByPriceOffers(null, VERBS.GET, null, queryParams);

        if (success) {
          dispatch({ type: "APPEND_PRODUCTS", payload: data.items });

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

    fetchAndLoadProducts();
  }, [seller, currentPage]);

  const handleSelectProduct = async (product) => {
    navigation.navigate("product-details", {
      product
    });
  };

  const handleAddToCart = async (item) => {
    item.isAdded = true
    await addToCart(item)
  };

  const handleLoadMore = () => {
    if (state.products.length >= state.pageInfo || state.loading) return
    if (currentPage < state.pageInfo) {
      setCurrentPage(currentPage + 1);
    }
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
        {
          category ? (
            <>{category.name}</>
          ) : (<>
            Price Offers
          </>)
        }

      </Text>
      <View style={{ flex: 1 }} />
      <NotifyCart navigation={navigation} />
    </View>
  )
  const renderFooter = () => (state.loading ? <ActivityIndicator size={100} color={MATERIAL_COLORS.grey[500]} animating /> : null);
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.columnContainer} onPress={() => handleSelectProduct(item)}>
          <Image
            style={styles.image}
            source={item.secure_url ? { uri: item.secure_url } : require('../assets/images/no_image.png')}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.unit}>Unit {item.unit}</Text>
            {item.offer_price > 0 ? (
              <View style={styles.columnContainer}>
                <Text style={styles.price}>{formatCurrency(seller.currency || "", item.offer_price)}</Text>
                <Text style={{ ...styles.price, fontWeight: '600', textDecorationLine: 'line-through', color: MATERIAL_COLORS.grey[700] }}>
                  {formatCurrency(seller.currency, item.price)}
                </Text>
              </View>
            ) : (
              <Text style={styles.price}>{formatCurrency(seller.currency || "", item.price)}</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }}></View>
        <View style={{ ...styles.rowContainer, justifyContent: 'flex-end', marginTop: 8,   position: 'absolute',
            top: 1,
            right: 4, }}>
        <StyledCycle
            borderWidth={1}
            height={40}
            width={40}
            backgroundColor={theme.colors.gray[100]}>
            <Icon
              size={40}
              name={'plus-circle'}
              color={theme.colors.green[600]}
              onPress={()=> handleAddToCart(item)}
            />
          </StyledCycle>
        </View>
      </View>
    )

  };
  return (
    <SafeAreaView style={styles.container}>
      <Spacer />
      <RenderHeader />
      <View style={{ ...styles.columnContainer, flex: 1, backgroundColor: MATERIAL_COLORS.grey[200] }}>
        <FlatList
          initialNumToRender={100}
          decelerationRate={"fast"}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          data={state.products}
          onEndReached={() => handleLoadMore()}
          onEndReachedThreshold={0.5}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: MATERIAL_COLORS.red[500],
    borderRadius: 30,
    color: MATERIAL_COLORS.grey[1],
    paddingVertical: 1,
    paddingHorizontal: 10,
    fontSize: MATERIAL_FONTS_SIZES.font_size_micro,
    fontFamily: FONT_FAMILY.crimson_text_regular
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'relative',
    width: screenWidth / 2 - 20
  },
  columnContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%'
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
    borderRadius: 16,
    height: 200,
    resizeMode: 'cover',
    width: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 2,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    marginLeft: 8
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  name: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    textAlign: 'center',
    paddingTop:8
  },
  price: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    fontWeight: 'bold',
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: MATERIAL_COLORS.grey[1],
    borderColor: MATERIAL_COLORS.grey[500],
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 8,
    paddingHorizontal: 16
  },
  seeAll: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
  },
  text: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
  },
  textContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
  },
  unit: {
    color: MATERIAL_COLORS.grey[600],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_small,
  },
});

export default ProductPriceOffers;
