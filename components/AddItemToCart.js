import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from '../constants';
import { useCart } from './hooks/CartProvider';

const AddItemToCart = ({ item }) => {
  const { getCartItem, addToCart, reduceItemQuantity } = useCart()
  const [count, setCount] = useState(item?.isAdded ? item.quantity : 0);

  useEffect(() => {
    async function getItemCount() {
      const itemCount = await getCartItem(item._id)    
      setCount(itemCount || 0)
    }
    getItemCount()
  }, [item.quantity])

  const increaseItem = () => {
    setCount(prevCount => {
      const newCount = prevCount + 1;
      return newCount;
    });

    addToCart(item);
  };

  const decreaseItem = () => {
    setCount(prevCount => {
      if (prevCount > 0) {
        const newCount = prevCount - 1;
        return newCount;
      }
      return prevCount;
    });

    reduceItemQuantity(item);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={decreaseItem}
      >
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.countText}>{count}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={increaseItem}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: MATERIAL_COLORS.grey[500],
    borderRadius: 24,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  buttonText: {
    fontSize: MATERIAL_FONTS_SIZES.font_size_xxlarge,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  countText: {
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    marginHorizontal: 20,
  },
});

export default AddItemToCart;
