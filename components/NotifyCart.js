import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {  StyledCycle } from 'fluent-styles';
import { useCart } from './hooks/CartProvider';
import {
    MATERIAL_COLORS,
    MATERIAL_FONTS_SIZES
} from "../constants";

const NotifyCart = ({ navigation }) => {
    const { cart } = useCart();

    const handlePress = () => {
        navigation.navigate('shopping-cart');
    };
       
    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <StyledCycle height={48} width={48} backgroundColor={MATERIAL_COLORS.grey[200]} >
            <View style={styles.iconContainer}>
                <Icon
                    name="cart"
                    size={32}
                    color={MATERIAL_COLORS.grey[800]}
                />
                {cart.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cart.length}</Text>
                    </View>
                )}
            </View>
            </StyledCycle>
           
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    badge: {       
        alignItems: 'center',
        backgroundColor: MATERIAL_COLORS.red[400],
        borderRadius: 50,   
        color: MATERIAL_COLORS.grey[1],
        height: 20,
        justifyContent: 'center',    
        position: 'absolute',
        right: -1,
        top: -4,
        width: 20,
        zIndex: 1
    },
    badgeText: {
        color: MATERIAL_COLORS.grey[1],
        fontSize : MATERIAL_FONTS_SIZES.font_size_micro
    },
    container: {
        marginRight: 20, 
    },
    iconContainer: {
        position: 'relative',
    }
});

export default NotifyCart;
