/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES, MATERIAL_SPACING, FONT_FAMILY } from "../constants";
import { useCart } from "../components/hooks/CartProvider";
import AddItemToCart from "../components/AddItemToCart";
import { calculateCartTotal, formatCurrency } from '../util/helpers';
import { useAppContext } from "../components/hooks/AppContext";
import Spacer from "../components/Spacer";

const ShoppingCard = ({ navigation }) => {
  const { cart = [], removeFromCart } = useCart()
  const { seller: { currency, canPlaceOrder }, user, setFrom } = useAppContext()
  const redirectToLogin = "login";
  const redirectToShippingMethod = "shipping-method";
  const redirectToShippingAddress = "shipping-address";
  const FROM_SHOPPING_CART = "shopping-cart";

  const handleCheckOut = () => {
    if (!user) {
      setFrom(FROM_SHOPPING_CART);
      navigation.navigate(redirectToLogin);
    } else if (user && Object.values(user.shipping_address).every(value => value === "")) {
      navigation.navigate(redirectToShippingAddress);
    } else {
      navigation.navigate(redirectToShippingMethod);
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
        Shopping Cart
      </Text>
      <View style={{ flex: 1 }} />
    </View>
  )
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.secure_url ? (
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
      <View style={styles.details}>
        <View style={styles.rowContainer}>
          <Text style={{ ...styles.name, flex: 5 }}>{item.name}</Text>
          <TouchableOpacity onPress={() => removeFromCart(item._id)}>
            <Icon
              name="delete"
              size={30}
              color={MATERIAL_COLORS.grey[800]}
              style={{ flex: 1 }}
            />
          </TouchableOpacity>

        </View>
        <Text style={styles.unit}>Unit: {item.unit}</Text>
        <Text style={styles.price}>{formatCurrency(currency, item.price)}</Text>
        <View style={{...styles.rowContainer, justifyContent: 'flex-end'}}>
          <AddItemToCart item={item} />
        </View>
      </View>
    </View>
  )

  const EmptyCart = () => {
    return (
      <View style={styles.emptyCartContainer}>
        <Icon name="cart-off" size={100} color={MATERIAL_COLORS.purple[800]} />
        <Text style={styles.message}>{`Your Cart is Feeling a Bit Light! \nIt seems your cart is empty right now,Why not start shopping and explore our fantastic selection of items?`}</Text>
        <TouchableOpacity style={{ ...styles.continue, width: '50%', marginTop: 8 }} onPress={() => navigation.navigate("products")} >
          <View style={{ ...styles.rowContainer, justifyContent: 'center' }}>
            <Text style={{ ...styles.checkOutText }} >Start Shopping</Text>
          </View>

        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spacer />
      <RenderHeader />
      <View style={{ marginVertical: 4 }}></View>
      {
        cart.length > 0 ? (
          <>
            <View style={{ flex: 1, paddingHorizontal: 8, marginHorizontal: 8, paddingBottom: 56, backgroundColor: MATERIAL_COLORS.grey[200] }}>
              <FlatList
                initialNumToRender={100}
                decelerationRate={"fast"}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                data={cart}
                renderItem={renderItem}
              />
            </View>
            {
              canPlaceOrder && (
                <TouchableOpacity
                  style={styles.continueContainer}
                  onPress={handleCheckOut}
                >
                  <View style={{ ...styles.continue }}>
                    <View style={styles.rowContainer}>
                      <Text style={styles.checkOutAmountText}>{calculateCartTotal(currency, cart)}</Text>
                      <Text style={styles.checkOutText} >CheckOut</Text>
                    </View>

                  </View>

                </TouchableOpacity>
              )
            }

          </>
        )
          : (
            <EmptyCart />
          )
      }


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: MATERIAL_COLORS.grey[1],
    borderColor: MATERIAL_COLORS.grey[1],
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    flexDirection: "row",
    justifyContent: 'flex-start',
    marginBottom: 8,
    padding: 8
  },
  checkOutAmountText: {
    color: MATERIAL_COLORS.grey[1],
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    fontWeight: "bold",
    textAlign: "center",
  },
  checkOutText: {
    color: MATERIAL_COLORS.grey[100],
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    fontWeight: 'bold',
    textAlign: "center",
  },
  container: {
    backgroundColor: MATERIAL_COLORS.grey[100],
    flex: 1,
    position: 'relative'
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
  details: {
    flex: 1,
  },
  emptyCartContainer: {
    alignItems: 'center',
    backgroundColor: MATERIAL_COLORS.grey[1],
    flex: 1,
    justifyContent: 'center'
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
    height: 110,
    marginRight: 10,
    width: 70,
    borderRadius : 16
  },
  message: {
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    marginTop: 10,
    textAlign: 'center',
    width: '90%'
  },
  name: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal
  },
  price: {
    color: MATERIAL_COLORS.green[800],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
    fontWeight: 'bold',
   
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  unit: {
    fontSize: MATERIAL_FONTS_SIZES.font_size_small,
    marginBottom: 4
  },
});

export default ShoppingCard;
