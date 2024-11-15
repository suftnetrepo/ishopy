import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  addToCart as addToCartFunc,
  removeFromCart as removeFromCartFunc,
  updateCartItemQuantity as updateCartItemQuantityFunc,
  getCartItems as getCartItemsFunc,
  reduceItemQuantity as reduceItemQuantityFunc,
  clearCart as clearCartFunc,
  getTotalItemsInCart,
} from '../../util/shoppingCart';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCartFromAsyncStorage = async () => {
      try {
        const cartItems = await getCartItemsFunc();
        setCart(cartItems || []);
      } catch (error) {
        console.error('Failed to load cart from AsyncStorage:', error);
      }
    };

    loadCartFromAsyncStorage();
    startCart()
  }, []);

  const addToCart = async (item) => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem._id === item._id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      const priceToUse = item.offer_price > 0 ? item.offer_price : item.price;
      setCart([...cart, { ...item, quantity: 1, price: priceToUse }]);
    }
    await addToCartFunc(item);
  };

  const removeFromCart = async (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    await removeFromCartFunc(itemId);
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    const updatedCart = cart.map((item) => {
      if (item._id === itemId) {
        item.quantity = newQuantity;
      }
      return item;
    });
    setCart(updatedCart);
    await updateCartItemQuantityFunc(itemId, newQuantity);
  };

  const reduceItemQuantity = async (item) => {
    const existingItemIndex = cart.findIndex((cartItem) => cartItem._id === item._id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity -= 1;
      setCart(updatedCart);
    }
    await reduceItemQuantityFunc(item);
  };

  const getCartItem = async (itemId) => {
   const item = cart.find((item) => item._id === itemId);
    return item.quantity
  };

  const clearCartItems = async () => {
    setCart([])
    await clearCartFunc()
  };

  const startCart = async () => {
    const count = await getTotalItemsInCart()
    if (count === 0) {
      setCart([])
      await clearCartFunc()
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartItem,
    reduceItemQuantity,
    clearCartItems,
    startCart
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
