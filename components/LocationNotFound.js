import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MATERIAL_COLORS, MATERIAL_FONTS_SIZES, FONT_FAMILY } from '../constants';

const LocationNotFound = () => {
  return (
    <View style={styles.container}>
      <Icon name="exclamation" size={50} color="red" />
      <Text style={styles.message}>No Store found in this location</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: MATERIAL_COLORS.grey[1],
    flex: 1,
    justifyContent: 'center'
  },
  message: {   
    color :  MATERIAL_COLORS.grey[800],
    fontFamily : FONT_FAMILY.crimson_text_regular,
    fontSize : MATERIAL_FONTS_SIZES.font_size_large,
    marginTop: 10,
    textAlign: 'center',
    width: '70%'
  },
});

export default LocationNotFound;
