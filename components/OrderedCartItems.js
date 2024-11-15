import React from 'react';
import { View, Image, Text, FlatList, StyleSheet } from 'react-native';
import { formatCurrency } from '../util/helpers';
import { FONT_FAMILY, MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from '../constants';

const OrderedCartItems = ({items, currency}) => {     
    const RenderItem = ({ item }) => (
        <View style={styles.card}>
            {item.secure_url ? (
                <Image
                    style={styles.image}
                    source={{
                        uri: item.secure_url,
                    }}
                >
                </Image>
            ) : (
                <Image
                    style={styles.image}
                    source={require('../assets/images/no_image.png')}
                >
                </Image>
            )}
            <View style={styles.details}>
                <View style={{ ...styles.rowContainer, width: '100%' }}>
                    <Text style={{ ...styles.name, flex: 5 }}>{item.name}</Text>
                    <Text style={{ ...styles.name, flex: 1, textAlign: 'right' }}>x{item.quantity}</Text>
                </View>
                <Text style={styles.unit}>Unit: {item.unit}</Text>
                <Text style={styles.price}>{formatCurrency(currency || "", item.price)}</Text>
            </View>
        </View>
    )

    return (
        <>
        {
            items.map((item, index)=> {
                return (
                    <RenderItem item={item} key={index} />
                )
            })
        }
        </>
            
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        backgroundColor: MATERIAL_COLORS.grey[1],
        borderColor: MATERIAL_COLORS.grey[1],
        borderRadius: 1,
        borderWidth: 1,
        elevation: 2,
        flexDirection: "row",
        justifyContent: 'flex-start',
        marginBottom: 1,
        padding: 8
    },
   
    details: {
        flex: 1,
    },
    image: {
        height: 60,
        marginRight: 5,
        width: 60,
    },
    name: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    },
    price: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
        fontWeight: 'bold',
        marginBottom: 4
    },
    rowContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    unit: {
        fontSize: 14,
    },
});

export default OrderedCartItems;
