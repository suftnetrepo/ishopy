import React, { useEffect, useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { BottomNavigator } from "./components";
import IconMaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProductDetails from './screens/ProductDetails';
import NetworkNotAvailableScreen from "./components/NetworkNotAvailableScreen";
import AppProvider from './components/hooks/AppContext';
import Register from './screens/Register';
import Settings from './screens/Settings';
import EditProfile from './screens/EditProfile';
import { getOne } from './store/single-store';
import Products from './screens/Products';
import Categories from './screens/Categories';
import { CartProvider } from './components/hooks/CartProvider';
import ShoppingCart from './screens/ShoppingCart';
import CodeVerification from './screens/CodeVerification';
import Login from './screens/Login';
import ShippingAddress from './screens/ShippingAddress';
import ShippingMethods from './screens/ShippingMethods';
import PaymentMethods from './screens/PaymentMethods';
import CheckOut from './screens/CheckOut';
import Orders from './screens/Orders';
import OrderDetails from './screens/OrderDetails';
import EditShippingAddress from './screens/EditShippingAddress';
import useNetworkAvailability from './components/hooks/useNetworkAvailability ';
import StatusBar from './components/StatusBar';
import ProductPriceOffers from './screens/ProductPriceOffers';
import SearchSeller from './screens/SearchSeller';


IconMaterialCommunity.loadFont();
Ionicons.loadFont();

const Stack = createStackNavigator();

const App = () => {
  const [registrationCompleted, setRegistrationCompleted] = useState(false);
  const isConnected = useNetworkAvailability();

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      try {
        const value = await getOne("SELLER");
        if (value) {
          setRegistrationCompleted(true);
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      } finally {
        // SplashScreen.hide();
      }
    };

    fetchRegistrationStatus();
  }, []);

  const AppNavigator = () => (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }} initialRouteName={`${registrationCompleted ? 'bottomNavigator' : 'searchSeller'}`} >
        <Stack.Screen name="searchSeller" component={SearchSeller} />
        <Stack.Screen name="bottomNavigator" component={BottomNavigator} />
        <Stack.Screen name="product-details" component={ProductDetails} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen name="edit-profile" component={EditProfile} />
        <Stack.Screen name="products" component={Products} />
        <Stack.Screen name="product-price-offers" component={ProductPriceOffers} />
        <Stack.Screen name="categories" component={Categories} />
        <Stack.Screen name="shopping-cart" component={ShoppingCart} />
        <Stack.Screen name="codeVerification" component={CodeVerification} />
        <Stack.Screen name="shipping-address" component={ShippingAddress} />
        <Stack.Screen name="edit-shipping-address" component={EditShippingAddress} />
        <Stack.Screen name="shipping-method" component={ShippingMethods} />
        <Stack.Screen name="payment-method" component={PaymentMethods} />
        <Stack.Screen name="checkout" component={CheckOut} />
        <Stack.Screen name="orders" component={Orders} />
        <Stack.Screen name="order-details" component={OrderDetails} />
        <Stack.Screen name="login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  )

  const NetWorkNavigator = () => (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="network-not-available" component={NetworkNotAvailableScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

  const RenderApp = ({ isConnected }) => {
    return isConnected ? <AppNavigator /> : <NetWorkNavigator />;
  };

  return (
    <AppProvider>
      <CartProvider>
        {
          isConnected && (
            <StatusBar />
          )
        }
        <RenderApp isConnected={isConnected} />
      </CartProvider>
    </AppProvider>
  );
};

export default App;