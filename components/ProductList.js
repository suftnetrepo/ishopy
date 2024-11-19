import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MATERIAL_COLORS, FONT_FAMILY, MATERIAL_FONTS_SIZES} from '../constants';
import {
  StyledCycle,
} from 'fluent-styles';
import {formatCurrency} from '../util/helpers';
import {useAppContext} from './hooks/AppContext';
import {useCart} from './hooks/CartProvider';
import { theme } from '../util/theme';

const screenWidth = Dimensions.get('window').width;

const ProductList = ({navigation, products = []}) => {
  const {seller} = useAppContext();
  const {addToCart} = useCart();
  const {currency} = seller;

  const handleSelectProduct = product => {
    navigation.navigate('product-details', {
      product,
    });
  };

  const handleAddToCart = async item => {
    item.isAdded = true;
    await addToCart(item);
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.columnContainer}
          onPress={() => handleSelectProduct(item)}>
          <Image
            style={styles.image}
            source={
              item.secure_url
                ? {uri: item.secure_url}
                : require('../assets/images/no_image.png')
            }
          />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.unit}>Unit {item.unit}</Text>
            {item.offer_price > 0 ? (
              <View style={styles.columnContainer}>
                <Text style={styles.price}>
                  {formatCurrency(currency || '', item.offer_price)}
                </Text>
                <Text
                  style={{
                    ...styles.price,
                    fontWeight: '600',
                    textDecorationLine: 'line-through',
                    color: MATERIAL_COLORS.grey[700],
                  }}>
                  {formatCurrency(seller.currency, item.price)}
                </Text>
              </View>
            ) : (
              <Text style={styles.price}>
                {formatCurrency(currency || '', item.price)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={{flex: 1}}></View>
        <View
          style={{
            ...styles.rowContainer,
            justifyContent: 'flex-end',
            marginTop: 1,
            position: 'absolute',
            top: 1,
            right: 4,
          }}>
          <StyledCycle
            borderWidth={1}
            height={48}
            width={48}
            backgroundColor={theme.colors.gray[100]}>
            <Icon
              size={48}
              name={'plus-circle'}
              color={theme.colors.green[600]}
              onPress={()=> handleAddToCart(item)}
            />
          </StyledCycle>
        </View>
      </View>
    );
  };

  return (
    <>
      {products.length > 0 && (
        <View>
          <View style={styles.textContainer}>
            <Text style={{...styles.title, ...styles.border_Container}}>
              Popular Items
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('products')}>
              <Text style={styles.seeAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.columnContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={products}
              initialNumToRender={100}
              renderItem={renderItem}
              keyExtractor={item => item._id}
              numColumns={2}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'red',
    borderRadius: 5,
    color: 'white',
    padding: 5,
  },
  border_Container: {
    borderColor: MATERIAL_COLORS.grey[100],
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 2,
    justifyContent: 'space-between', // This will push the children apart
    marginHorizontal: 8,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'relative',
    width: screenWidth / 2 - 20,
  },
  columnContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
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
    justifyContent: 'space-between',
  },
  seeAll: {
    color: MATERIAL_COLORS.green[700],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_small,
  },
  text: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text,
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  title: {
    color: MATERIAL_COLORS.grey[500],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
  },
  unit: {
    color: MATERIAL_COLORS.grey[600],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_small,
  },
});

export default ProductList;
