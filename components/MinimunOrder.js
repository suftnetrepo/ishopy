import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FONT_FAMILY, MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from '../constants';

const MinimumOrder = ({seller}) => {
    return (
        <View style={{ ...styles.messageBox, ...styles.row }}>
            <View style={{ ...styles.column, flex: 1 }}>
                <Icon name="information" size={64} color={MATERIAL_COLORS.blue[600]} style={styles.icon} />
            </View>
            <View style={{ flex: 4 }}>
                <View style={{ ...styles.row }} >
                    <View>
                        <Text style={styles.title}>Minimum Order</Text>
                        <Text style={styles.message}>
                           Orders now require a minimum
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.amount}> {seller.currency}{seller.minimum_delivery_order} </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    amount: {
		color: MATERIAL_COLORS.grey[800],
		fontFamily: FONT_FAMILY.crimson_text_regular,
		fontSize: MATERIAL_FONTS_SIZES.font_size_xlarge,
		fontWeight: 'bold'
	},
    column: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    icon: {
        marginRight: 8
    },
    message: {
        fontSize: 16,
    },
    messageBox: {
        alignItems: 'flex-start',
        backgroundColor :MATERIAL_COLORS.grey[1],
        borderColor : MATERIAL_COLORS.grey[1],
        borderRadius: 8,
        borderWidth: 0.5,
        marginBottom: 8,
        marginHorizontal: 8,
        marginTop : 8,
        paddingHorizontal: 4,
        paddingVertical: 4
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
        fontWeight: 'bold'
    },
});

export default MinimumOrder;
