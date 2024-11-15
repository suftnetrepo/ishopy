import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FONT_FAMILY, MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from '../constants';

const OutOfDeliveryRangeMessage = () => {
    return (
        <View style={styles.messageBox}>
            <View style={styles.row}>
                <Icon name="information" size={30} color={MATERIAL_COLORS.blue[600]} style={styles.icon} />
                <Text style={styles.title}>Delivery Out of Range</Text>
            </View>
            <Text style={styles.message}>
                We're sorry, but your current location is not within our delivery range. You cannot place an order at this time.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        marginRight: 8
    },
    message: {
        fontSize: 16,
    },
    messageBox: {
        alignItems: 'flex-start',
        backgroundColor: MATERIAL_COLORS.orange[50],
        borderRadius: 8,
        borderWidth : 0.5,
        marginBottom : 8,
        marginHorizontal : 8,   
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
    title: {
        fontFamily:FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
        fontWeight: 'bold'
       
    },
});

export default OutOfDeliveryRangeMessage;
