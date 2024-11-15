/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import {
  MATERIAL_COLORS,
  FONT_FAMILY,
  MATERIAL_FONTS_SIZES,
} from "../constants";

const NetworkNotAvailableScreen = React.memo(() => {
  const navigation = useNavigation();
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);    
    });
   
    const intervalId = setInterval(() => {
      NetInfo.fetch().then((state) => {
        setIsConnected(state.isConnected);       
      });   
 
    }, 10000); 

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };  

  }, []);

  useEffect(() => {
    if (isConnected) {
      navigation.replace("start");
    }
  }, [isConnected, navigation]);

  return (
    <View style={styles.container}>
      <Icon
        name="access-point-network"
        size={120}
        color={MATERIAL_COLORS.grey[200]}
      />
      <Text style={styles.title}>No Connection</Text>
      <Text style={styles.description}>
        Please Check your internet connectivity
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: MATERIAL_COLORS.grey[1],
    flexDirection: 'column',
    flex: 1,
    justifyContent: "center",
  },
  description: {
    fontFamily: FONT_FAMILY.crimson_text_regular,
    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    marginHorizontal: 40,
    textAlign: "center",
  },
  title: {
    fontFamily: FONT_FAMILY.crimson_text_bold,
    fontSize: MATERIAL_FONTS_SIZES.font_size_large,
    marginTop: 15,
  },
});

export default NetworkNotAvailableScreen;


