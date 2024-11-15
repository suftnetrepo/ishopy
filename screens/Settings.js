import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import {
    MATERIAL_COLORS,
    FONT_FAMILY,
    MATERIAL_FONTS_SIZES,
    MATERIAL_SPACING,
} from '../constants';
import { useAppContext } from '../components/hooks/AppContext';
import SellerBasicInfo from '../components/SellerBasicInfo';
import { formatAddress } from '../util/helpers';
import { SafeAreaView } from 'react-native';
import Spacer from '../components/Spacer';
import { useCart } from '../components/hooks/CartProvider';
import useExitApp from '../components/hooks/useExitApp';

const Settings = ({ navigation }) => {
    const { seller: { secure_url, name, address, mobile, email }, logout, token } = useAppContext();
	const { clearCartItems } = useCart()
	const { exitApp } = useExitApp()

    const RenderHeader = () => (
        <View style={styles.header}>
            <View style={styles.iconContainer}>
                <Icon
                    name="arrow-left"
                    size={30}
                    color={MATERIAL_COLORS.grey[700]}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <Text
                style={{
                    color: MATERIAL_COLORS.grey[700],
                    fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
                    marginLeft: 8
                }}
            >
                Settings

            </Text>
            <View style={{ flex: 1 }} />
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <Spacer />
            <RenderHeader />
            <View style={{ ...styles.columnContainer, paddingVertical: 16 }}>
                <SellerBasicInfo
                    secure_url={`${secure_url}`}
                    fullName={`${name}`}
                    email={email}
                    mobile={mobile}
                    completeAddress={formatAddress(address)}
                />

                {
                    token && (
                        <>
                            <TouchableOpacity style={{ ...styles.cardContainer, ...styles.rowContainer, justifyContent: 'flex-start' }}
                                onPress={() => {
                                    navigation.navigate("edit-shipping-address")
                                }}  >
                                <Ionicons
                                    name="location-pin"
                                    size={30}
                                    color={MATERIAL_COLORS.grey[800]}
                                />
                                <Text style={{ ...styles.text, marginLeft: 1 }}>
                                    Change Address
                                </Text>
                                <View style={{ flex: 1 }}></View>
                                <Icon
                                    name="arrow-right-bold-circle"
                                    size={30}
                                    color={MATERIAL_COLORS.grey[800]}
                                />
                            </TouchableOpacity>
                        </>
                    )

                }
                <TouchableOpacity style={{ ...styles.cardContainer, ...styles.rowContainer, justifyContent: 'flex-start', marginTop: 2 }}
                    onPress={() => {
                        logout()
                        clearCartItems()
                        exitApp()
                    }}  >
                    <Icon
                        name="logout-variant"
                        size={30}
                        color={MATERIAL_COLORS.grey[800]}
                    />
                    <Text style={{ ...styles.text, marginLeft: 4 }}>
                        Logout
                    </Text>
                    <View style={{ flex: 1 }}></View>
                    <Icon
                        name="arrow-right-bold-circle"
                        size={30}
                        color={MATERIAL_COLORS.grey[800]}
                    />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: MATERIAL_COLORS.grey[1],
        borderColor: MATERIAL_COLORS.grey[100],
        borderRadius: 30,
        borderWidth: 1,
        marginHorizontal: 8,
        paddingHorizontal: 8,
        paddingVertical: 8
    },
    columnContainer: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: 'center'
    },
    container: {
        backgroundColor: MATERIAL_COLORS.grey[100],
        flex: 1,
        position: "relative",
    },
    header: {
        alignItems: 'center',
        backgroundColor: MATERIAL_COLORS.grey[1],
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingBottom: 8,
        paddingHorizontal: MATERIAL_SPACING.spacing_medium_14
    },
    headerText: {
        fontFamily: FONT_FAMILY.crimson_text,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
        marginHorizontal: 8,
    },
    iconContainer: {
        alignItems: 'center',
        borderColor: MATERIAL_COLORS.grey[500],
        borderRadius: 24,
        borderWidth: 1,
        flexDirection: 'column',
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    rowContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: 'flex-start',
    },
    text: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text,
        fontSize: MATERIAL_FONTS_SIZES.font_size_medium,
    },
});

export default Settings;
