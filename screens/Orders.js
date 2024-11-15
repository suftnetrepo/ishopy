/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React, {useState, useEffect, useReducer} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  MATERIAL_COLORS,
  MATERIAL_FONTS_SIZES,
  MATERIAL_SPACING,
  FONT_FAMILY,
} from '../constants';
import {  StyledButton } from 'fluent-styles';
import {useAppContext} from '../components/hooks/AppContext';
import {fetchCustomerOrderByPaging} from '../api';
import {convertToShortDate} from '../util/helpers';
import OrderStatus from '../components/OrderStatus';
import Spacer from '../components/Spacer';

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {...state, loading: true};
    case 'SET_MOUNTED':
      return {...state, mounted: true};
    case 'SET_ORDERS':
      return {
        ...state,
        loading: false,
        orders: action.payload,
        pageInfo: action.pageInfo,
      };
    case 'APPEND_ORDERS':
      return {
        ...state,
        loading: false,
        orders: [...state.orders, ...action.payload],
        pageInfo: action.pageInfo,
      };
    case 'SET_ERROR':
      return {...state, loading: false, error: action.payload};
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  orders: [],
  pageInfo: null,
  error: null,
  mounted: false,
};

const Orders = ({navigation}) => {
  const {user, token} = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState();
  const [state, dispatch] = useReducer(orderReducer, initialState);

  useEffect(() => {
    const fetchAndLoadOrders = async () => {
      try {
        dispatch({type: 'SET_LOADING'});
        const queryParams = {
          page: currentPage,
          limit: 20,
          filter: filter ? filter : '',
        };
        const {data, success} = await fetchCustomerOrderByPaging(
          null,
          'GET',
          token,
          queryParams,
        );
        dispatch({type: 'SET_MOUNTED'});

        if (success) {
          if (filter) {
            dispatch({
              type: 'SET_ORDERS',
              payload: data.orders,
              pageInfo: data.total,
            });
          } else {
            dispatch({
              type: 'APPEND_ORDERS',
              payload: data.orders,
              pageInfo: data.total,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch({type: 'SET_ERROR', payload: error});
      }
    };

    if (token) {
      fetchAndLoadOrders();
    }
  }, [user, token, currentPage, filter]);

  const handleOrderStatus = async status => {
    setFilter(status);
  };

  const handleLoadMore = () => {
    if (state.orders.length >= state.pageInfo || state.loading) return;
    if (currentPage < state.pageInfo) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSelectOrder = async order => {
    navigation.navigate('order-details', {
      order,
    });
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
  const renderFooter = () =>
    state.loading ? (
      <ActivityIndicator
        size={100}
        color={MATERIAL_COLORS.grey[500]}
        animating
      />
    ) : null;
  const renderItem = ({item}) => {
    const {backgroundColor, textColor} = getStatusColors(item.order_status);

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => handleSelectOrder(item)}>
        <View style={{...styles.rowContainer, justifyContent: 'space-between'}}>
          <View
            style={{
              ...styles.columnContainer,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <View style={styles.rowContainer}>
              <Icon
                name="record-circle"
                size={20}
                color={MATERIAL_COLORS.grey[800]}
              />
              <Text style={{...styles.text, marginLeft: 2, fontWeight: 'bold'}}>
                {item._id.slice(-8)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Icon
                name="calendar-clock"
                size={20}
                color={MATERIAL_COLORS.grey[800]}
              />
              <Text style={{...styles.text, marginLeft: 2}}>
                {convertToShortDate(item.createdAt)}
              </Text>
            </View>
          </View>
          <StyledButton backgroundColor={backgroundColor} borderColor={backgroundColor}   onPress={() => handleSelectOrder(item)}>
          <Text
            style={{
              ...styles.orderStatus,
              color: textColor,
            }}>
            {item.order_status}
          </Text>
          </StyledButton>
         
        </View>
      </TouchableOpacity>
    );
  };
  const EmptyCart = () => {
    return (
      <View style={styles.emptyCartContainer}>
        <Icon name="cart-off" size={100} color={MATERIAL_COLORS.purple[800]} />
        <Text
          style={
            styles.message
          }>{`No Orders Yet! \n It looks like you haven't placed any orders with us yet. But don't worry, your shopping journey is just a click away!?`}</Text>
        <TouchableOpacity
          style={{...styles.continue, width: '50%', marginTop: 8}}
          onPress={() => navigation.navigate('products')}>
          <View style={{...styles.rowContainer, justifyContent: 'center'}}>
            <Text style={styles.emptyCartButtonText}>Start Shopping</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (!filter && state.mounted && state.orders?.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <RenderHeader />
        <View style={{flex: 1}}>
          <EmptyCart />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Spacer />
      <RenderHeader />
      <OrderStatus onPress={status => handleOrderStatus(status)} />
      <FlatList
        initialNumToRender={100}
        decelerationRate={'fast'}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        data={state.orders}
        onEndReached={() => handleLoadMore()}
        onEndReachedThreshold={0.5}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: MATERIAL_COLORS.grey[1],
    borderColor: MATERIAL_COLORS.grey[100],
    borderRadius: 2,
    borderWidth: 1,
    elevation: 1,
    marginBottom: 8,
    marginHorizontal: 8,
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
  },
  continue: {
    backgroundColor: MATERIAL_COLORS.cyan[500],
    borderColor: MATERIAL_COLORS.cyan[500],
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '90%',
  },
  emptyCartButtonText: {
    color: MATERIAL_COLORS.grey[100],
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    textAlign: 'center',
  },
  emptyCartContainer: {
    alignItems: 'center',
    backgroundColor: MATERIAL_COLORS.grey[1],
    flex: 1,
    justifyContent: 'center',
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
  message: {
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    marginTop: 10,
    textAlign: 'center',
    width: '80%',
  },
  orderStatus: {
    color: MATERIAL_COLORS.cyan[800],
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    fontFamily: FONT_FAMILY.crimson_text_regular,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  text: {
    color: MATERIAL_COLORS.grey[800],
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Orders;
