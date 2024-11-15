/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyledButton} from 'fluent-styles';
import {
  MATERIAL_COLORS,
  MATERIAL_FONTS_SIZES,
  MATERIAL_SPACING,
  FONT_FAMILY,
} from '../constants';
import {useAppContext} from '../components/hooks/AppContext';
import {
  convertToShortDate,
  formatAddress,
  formatCurrency,
} from '../util/helpers';
import OrderedCartItems from '../components/OrderedCartItems';
import Spacer from '../components/Spacer';

const OrderDetails = ({navigation, route}) => {
  const {seller} = useAppContext();
  const order = route.params.order;

  const handleEmailPress = () => {
    const url = `mailto:${seller.email}`;
    linking(url);
  };

  const handleDialPress = () => {
    dialNumber(seller.mobile);
  };

  function dialNumber(number) {
    const url = `tel:${number}`;
    linking(url);
  }

  const linking = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle URL: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  function getStatusColors(orderStatus) {
    switch (orderStatus) {
      case 'Pending':
        return {
          backgroundColor: MATERIAL_COLORS.yellow[200],
          textColor: MATERIAL_COLORS.yellow[800],
        };
      case 'Processing':
        return {
          backgroundColor: MATERIAL_COLORS.amber[100],
          textColor: MATERIAL_COLORS.amber[800],
        };
      case 'Ready':
        return {
          backgroundColor: MATERIAL_COLORS.red[100],
          textColor: MATERIAL_COLORS.red[800],
        };
      case 'Dispatched':
        return {
          backgroundColor: MATERIAL_COLORS.purple[100],
          textColor: MATERIAL_COLORS.purple[800],
        };
      case 'Delivered':
        return {
          backgroundColor: MATERIAL_COLORS.green[100],
          textColor: MATERIAL_COLORS.green[800],
        };
      case 'Accepted':
        return {
          backgroundColor: MATERIAL_COLORS.cyan[100],
          textColor: MATERIAL_COLORS.cyan[800],
        };
      default:
        return {
          backgroundColor: MATERIAL_COLORS.purple[100],
          textColor: MATERIAL_COLORS.purple[800],
        };
    }
  }
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
          marginLeft: 8,
        }}>
        Orders
      </Text>
      <View style={{flex: 1}} />
    </View>
  );
  const RenderSellerCard = () => {
    const {name, address} = seller;
    return (
      <>
        <View style={styles.labelContainer}>
          <Text style={{...styles.labelName}}>Seller</Text>
        </View>
        <View
          style={{...styles.sellerContainer, justifyContent: 'space-between'}}>
          <View style={{...styles.sellerInfoContainer}}>
            <Text style={styles.sellerInfoName}>{name}</Text>

            <View style={{...styles.rowContainer}}>
              <Icon
                name="map-marker"
                size={35}
                color={MATERIAL_COLORS.grey[700]}
              />
              <Text style={styles.sellerAddress}>{address.addressline1}</Text>
            </View>
          </View>

          <View
            style={{
              ...styles.rowContainer,
              justifyContent: 'flex-end',
              flex: 1,
            }}>
            <View style={styles.iconContainer}>
              <Icon
                name="phone-outgoing"
                size={30}
                color={MATERIAL_COLORS.grey[700]}
                onPress={handleDialPress}
              />
            </View>
            <View style={{...styles.iconContainer, marginLeft: 8}}>
              <Icon
                name="email-send"
                size={30}
                color={MATERIAL_COLORS.grey[700]}
                onPress={handleEmailPress}
              />
            </View>
          </View>
        </View>
      </>
    );
  };
  const RenderAddress = () => {
    const {
      user: {shipping_address},
      shipping_method,
    } = order;
    return (
      <>
        <View style={styles.labelContainer}>
          <Text style={{...styles.labelName}}>Shipping Address</Text>
        </View>
        <View
          style={{
            ...styles.columnContainer,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            ...styles.addressCard,
          }}>
          <Text
            style={{
              ...styles.labelName,
              fontWeight: '700',
              color: MATERIAL_COLORS.grey[800],
            }}>
            {shipping_method}
          </Text>
          <View style={{...styles.rowContainer}}>
            <Icon
              name="map-marker"
              size={35}
              color={MATERIAL_COLORS.grey[700]}
            />
            <Text style={styles.addressText}>
              {formatAddress(shipping_address)}
            </Text>
          </View>
        </View>
      </>
    );
  };
  const OrderCard = () => {
    const {_id, createdAt, order_status, payment_status, payments = []} = order;
    const {backgroundColor, textColor} = getStatusColors(order_status);
    const color =
      payment_status === 'Paid'
        ? MATERIAL_COLORS.green[800]
        : MATERIAL_COLORS.red[800];
    return (
      <View style={styles.cardContainer}>
        <View style={{...styles.rowContainer, justifyContent: 'space-between'}}>
          <View
            style={{
              ...styles.columnContainer,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <View style={styles.rowContainer}>
              <Icon name="record-circle" size={20} color={color} />
              <Text style={{...styles.text, marginLeft: 2, fontWeight: 'bold'}}>
                {_id.slice(-8)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Icon
                name="calendar-clock"
                size={20}
                color={MATERIAL_COLORS.grey[800]}
              />
              <Text style={{...styles.text, marginLeft: 2}}>
                {convertToShortDate(createdAt)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Icon
                name="contactless-payment-circle"
                size={20}
                color={MATERIAL_COLORS.grey[800]}
              />
              {payments.length > 0 && (
                <Text style={{...styles.text, marginLeft: 2}}>
                  {payments[0].method}
                </Text>
              )}
            </View>
          </View>
          <StyledButton
            backgroundColor={backgroundColor}
            borderColor={backgroundColor}
            onPress={() => handleSelectOrder(item)}>
            <Text
              style={{
                ...styles.orderStatus,
                color: textColor,
              }}>
              {order_status}
            </Text>
          </StyledButton>
        </View>
      </View>
    );
  };

  const RenderPayContainer = () => {
    const {deliveryCharges, tax, total_tax, total, grand_total, items} = order;
    return (
      <View style={styles.payOrderContainer}>
        <View style={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
          <View style={{...styles.rowContainer, width: '100%'}}>
            <Text style={styles.summaryText}>
              Subtotal ({items.length}) items:{' '}
            </Text>
            <Text style={styles.summaryText}>
              {formatCurrency(seller.currency, total)}
            </Text>
          </View>
          <View style={{...styles.rowContainer, width: '100%'}}>
            <Text style={styles.summaryText}>Delivery Charges: </Text>
            <Text style={styles.summaryText}>
              {' '}
              {formatCurrency(seller.currency, deliveryCharges)}
            </Text>
          </View>
          {tax > 0 && (
            <View style={{...styles.rowContainer, width: '100%'}}>
              <Text style={styles.summaryText}>
                Tax({(tax * 100).toFixed(1)})% :{' '}
              </Text>
              <Text style={styles.summaryText}>
                {' '}
                {formatCurrency(seller.currency, total_tax)}
              </Text>
            </View>
          )}
          <View
            style={{
              ...styles.rowContainer,
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text
              style={{
                ...styles.summaryText,
                fontWeight: 'bold',
                fontSize: MATERIAL_FONTS_SIZES.font_size_xlarge,
              }}>
              Total:{' '}
            </Text>
            <Text
              style={{
                ...styles.summaryText,
                fontWeight: 'bold',
                fontSize: MATERIAL_FONTS_SIZES.font_size_xlarge,
              }}>
              {formatCurrency(seller.currency, grand_total)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Spacer />
      <RenderHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          marginTop: 8,
          marginHorizontal: 8,
          backgroundColor: MATERIAL_COLORS.grey[200],
        }}>
        <RenderSellerCard />
        <OrderCard />
        <RenderAddress />
        <OrderedCartItems items={order.items} currency={seller.currency} />
        <RenderPayContainer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addressCard: {
    backgroundColor: MATERIAL_COLORS.grey[1],
    borderColor: MATERIAL_COLORS.grey[1],
    borderRadius: 4,
    borderWidth: 1,
    elevation: 4,
    marginBottom: 8,
    padding: 8,
  },
  addressText: {
    color: MATERIAL_COLORS.grey[800],
    flex: 1,
    fontFamily: FONT_FAMILY.crimson_text,
    fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
  },
  cardContainer: {
    backgroundColor: MATERIAL_COLORS.grey[1],
    borderColor: MATERIAL_COLORS.grey[100],
    borderRadius: 2,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 8,
    padding: 8,
  },
  columnContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: MATERIAL_COLORS.grey[100],
    flex: 1,
    marginHorizontal: 8,
  },
  header: {
    alignItems: 'center',
    backgroundColor: MATERIAL_COLORS.grey[1],
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: MATERIAL_SPACING.spacing_medium_14,
    paddingVertical: 8,
  },
  headerText: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  imageContainer: {
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  labelContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  labelName: {
    color: MATERIAL_COLORS.grey[500],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
    marginLeft: 4,
  },
  orderStatus: {
    color: MATERIAL_COLORS.cyan[800],
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  payOrderContainer: {
    backgroundColor: MATERIAL_COLORS.grey[1],
    borderColor: MATERIAL_COLORS.grey[1],
    borderRadius: 4,
    borderWidth: 1,
    elevation: 4,
    marginBottom: 8,
    paddingTop: 16,
    padding: 8,
    paddingHorizontal: 16,
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sellerAddress: {
    color: MATERIAL_COLORS.grey[600],
    flex: 1,
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
  },
  sellerContainer: {
    alignItems: 'center',
    backgroundColor: MATERIAL_COLORS.grey[1],
    borderColor: MATERIAL_COLORS.grey[1],
    borderRadius: 4,
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    padding: 8,
  },
  sellerInfoContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  
    flex: 1,
  },
  sellerInfoName: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    fontWeight: 'bold',
  },
  summaryText: {
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    marginVertical: 2,
  },
  text: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
  },
});

export default OrderDetails;
