import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = 'shopping_cart';

export const addToCart = async (item) => {
  try {
    const existingCart = await AsyncStorage.getItem(CART_KEY);
    let cart = JSON.parse(existingCart) || [];

    const existingItem = cart.find((cartItem) => cartItem._id === item._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const priceToUse = item.offer_price > 0 ? item.offer_price : item.price;
      const newItem = { ...item, quantity: 1, price: priceToUse };   
      cart.push(newItem);
    }

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

export const getItem = async (id) => {
  try {
    const existingCart = await AsyncStorage.getItem(CART_KEY);
    let carts = JSON.parse(existingCart) || [];

    const cart = carts.find((cartItem) => cartItem._id === id) || {};    
    return cart
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const existingCart = await AsyncStorage.getItem(CART_KEY);
    let cart = JSON.parse(existingCart) || [];

    cart = cart.filter((item) => item._id !== itemId);

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

export const updateCartItemQuantity = async (itemId, newQuantity) => {
  try {
    const existingCart = await AsyncStorage.getItem(CART_KEY);
    let cart = JSON.parse(existingCart) || [];

    cart = cart.map((item) => {
      if (item._id === itemId) {
        item.quantity = newQuantity;
      }
      return item;
    });

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
  }
};

export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error('Error clearing cart items:', error);
  }
};

export const reduceItemQuantity = async (item) => {
  try {
    const existingCart = await AsyncStorage.getItem(CART_KEY);
    let cart = JSON.parse(existingCart) || [];

    const existingItemIndex = cart.findIndex((cartItem) => cartItem._id === item._id);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity -= 1;
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
  }
};

export const getCartItems = async () => {
  try {
    const cart = await AsyncStorage.getItem(CART_KEY);
    return JSON.parse(cart) || [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

export const getTotalItemsInCart = async () => {
  try {
    const cart = await AsyncStorage.getItem(CART_KEY);
    const cartItems = JSON.parse(cart) || [];
    return cartItems.length;
  } catch (error) {
    console.error('Error calculating total items in cart:', error);
    return 0;
  }
};
