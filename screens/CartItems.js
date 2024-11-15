import React from 'react';
import { View, Image, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { formatCurrency } from '../util/helpers';
import { useCart } from '../components/hooks/CartProvider';
import { useAppContext } from '../components/hooks/AppContext';
import { FONT_FAMILY, MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from '../constants';

const CartItems = ({ navigation, show = false }) => {
    const { cart = [] } = useCart()
    const { seller: { currency } } = useAppContext()

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
                show && (
                    <View style={{ ...styles.labelContainer, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ ...styles.labelName }}>Items</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("shopping-cart")}>
                            <Text style={{ ...styles.labelName }}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                {
                    cart.map((cart, index)=> {
                        return (
                            <RenderItem item={cart} key={index} />
                        )
                    })
                }
            </ScrollView>
           
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        backgroundColor: MATERIAL_COLORS.grey[1],
        borderColor: MATERIAL_COLORS.grey[1],
        borderRadius: 16,
        borderWidth: 1,
        elevation: 2,
        flexDirection: "row",
        justifyContent: 'flex-start',
        marginBottom: 1,
        padding: 8
    },
    container: {
        flex: 1,
        marginBottom: 8,
        marginHorizontal: 16

    },
    details: {
        flex: 1,
    },
    image: {
        height: 60,
        marginRight: 5,
        width: 60,
        resizeMode : 'cover',
        borderRadius : 16
    },
    labelContainer: {
        alignItems: 'flex-start',
        flexDirection: "column",
        justifyContent: 'flex-start',
        marginBottom: 8,
        marginHorizontal: 16
    },
    labelName: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
        marginLeft: 4
    },
    name: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    },
    price: {
        color: MATERIAL_COLORS.green[800],
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

export default CartItems;
