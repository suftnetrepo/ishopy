import React, { useEffect, useState, useReducer } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    MATERIAL_COLORS,
    FONT_FAMILY,
    MATERIAL_FONTS_SIZES,
    VERBS,
} from '../constants';
import ProgressDialog from "../components/ProgressDialog";
import { getGreetings, formatAddress, haversineDistance } from '../util/helpers';
import useLocation from '../components/hooks/useLocation';
import { useAppContext } from '../components/hooks/AppContext';
import LocationNotFound from '../components/LocationNotFound';
import { fetchBySearch, fetchByCoordinates } from '../api';
import Spacer from "../components/Spacer";
import { useCart } from '../components/hooks/CartProvider';
import ConfirmDialog from '../components/ConfirmDialog';

const initialState = {
    loading: false,
    filter: false,
    mounted: false,
    sellers: [],
    copySellers: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return { ...state, filter: action.payload };
        case 'START_LOADING':
            return { ...state, loading: true };
        case 'END_LOADING':
            return { ...state, loading: false };
        case 'SET_MOUNTED':
            return { ...state, mounted: true };
        case 'SET_SELLERS':
            return { ...state, sellers: action.payload.sellers };
        case 'SET_COPY_SELLERS':
            return { ...state, copySellers: action.payload.sellers };
        default:
            throw new Error();
    }
};

const SearchScreen = ({ navigation }) => {
    const location = useLocation()
    const { from, setFrom, saveSeller } = useAppContext()
    const { clearCartItems } = useCart()
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchAndLoadSellers = async () => {
            try {
                if (location.latitude && location.longitude) {
                    const queryParams = { latitude: location.latitude, longitude: location.longitude, radiusInRadians: "20" }
                    dispatch({ type: 'START_LOADING' });
                    const { success, data } = await fetchByCoordinates(null, VERBS.GET, null, queryParams)
                    dispatch({ type: 'SET_MOUNTED' });

                    if (success) {
                        const sortedSellers = data.sellers.map((seller) => {
                            const haversine = haversineDistance(location, { latitude: seller.location.coordinates[1], longitude: seller.location.coordinates[0] })
                            return {
                                ...seller,
                                distance: haversine.formattedDistance,
                            };
                        }).sort((a, b) => a.distance - b.distance);
                        const payload =
                        {
                            sellers: sortedSellers
                        }
                        dispatch({ type: 'SET_SELLERS', payload });
                        dispatch({ type: 'SET_COPY_SELLERS', payload });
                    }
                }
            } catch (error) {
                console.error("Error fetching sellers:", error);
            } finally {
                dispatch({ type: 'END_LOADING' });
            }
        };

        fetchAndLoadSellers();
    }, [location.latitude, location.longitude]);

    const handleSearch = async () => {

        try {
            if (searchQuery) {
                dispatch({ type: 'START_LOADING' });
                const queryParams = { keywords: searchQuery.trim() }
                const { data, success } = await fetchBySearch(null, VERBS.GET, null, queryParams)

                if (success) {
                    const payload =
                    {
                        sellers: data.sellers
                    }
                    dispatch({ type: 'SET_SELLERS', payload });
                }
            }
        } catch (error) {
            console.error("Error fetching sellers:", error);
        } finally {
            dispatch({ type: 'END_LOADING' });
        }
    };

    const onContinue = () => {
        clearCartItems()
        navigation.navigate("bottomNavigator")
    }

    const handleSellerSelect = (seller) => {
        try {
            const haversine = haversineDistance(location, { latitude: seller.location.coordinates[1], longitude: seller.location.coordinates[0] })
            const canPlaceOrder = parseInt(seller.maximum_delivery_distance) > haversine.distance

            seller = {
                ...seller,
                canPlaceOrder : true // remember to set as default.
            }

            saveSeller({ seller })

            if (!canPlaceOrder) {
                setIsDialogVisible(true);
                return
            }
            onContinue()

        } catch (error) {
            console.error(error)
        }
    }

    const handleContinue = async () => {
        setIsDialogVisible(false);
        onContinue()
    }

    const handleCancel = () => {
        setIsDialogVisible(false);
    };

    const RenderHeader = () => (
        <View style={styles.header}>
            <View style={styles.userContainer}>
                <Text style={styles.greeting}>{getGreetings()}</Text>
                <Text style={styles.userName}>Welcome to iShopy</Text>
            </View>
            {
                (from) && (
                    <View style={styles.iconContainer}>
                        <Icon
                            name="window-close"
                            size={30}
                            color={MATERIAL_COLORS.grey[800]}
                            onPress={() => {
                                setFrom(false)
                                navigation.navigate(from)
                            }}
                        />
                    </View>
                )
            }
        </View>
    )

    if (!state.filter && state.mounted && state.sellers?.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <Spacer />
                <RenderHeader />
                <View style={{ backgroundColor: MATERIAL_COLORS.grey[300], paddingTop: 8, width: '100%' }}>
                    <View style={{ ...styles.rowStartContainer, justifyContent: 'flex-start' }}>
                        <View style={{ ...styles.searchBar, flex: 4 }}>

                            <TextInput
                                style={styles.input}
                                placeholder="Search for by name, address ..."
                                value={searchQuery}
                                maxLength={50}
                                onChangeText={text => setSearchQuery(text)}
                                onSubmitEditing={handleSearch}
                            />
                            {
                                searchQuery && (
                                    <TouchableOpacity onPress={() => {
                                        setSearchQuery("")
                                    }}>
                                        <Icon
                                            name="window-close"
                                            size={30}
                                            color={MATERIAL_COLORS.grey[600]}
                                            style={{ width: 48 }}
                                        />
                                    </TouchableOpacity>
                                )
                            }

                        </View>
                        <TouchableOpacity style={{ ...styles.searchContainer, flex: 1 }} onPress={handleSearch}>
                            <Ionicons
                                name="search"
                                size={30}
                                color={MATERIAL_COLORS.grey[600]}
                                style={{ width: 28 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <LocationNotFound />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Spacer />
            <RenderHeader />
            <View style={{ backgroundColor: MATERIAL_COLORS.grey[300], flex: 1, paddingTop: 8, width: '100%' }}>
                <View style={{ ...styles.rowStartContainer, justifyContent: 'flex-start' }}>
                    <View style={{ ...styles.searchBar, flex: 3 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="Search for by name, address ..."
                            value={searchQuery}
                            maxLength={50}
                            onChangeText={text => setSearchQuery(text)}
                            onSubmitEditing={handleSearch}
                        />
                        {
                            searchQuery && (
                                <TouchableOpacity onPress={() => {
                                    setSearchQuery("")
                                }}>
                                    <Icon
                                        name="window-close"
                                        size={30}
                                        color={MATERIAL_COLORS.grey[600]}
                                        style={{ width: 48 }}
                                    />
                                </TouchableOpacity>
                            )
                        }

                    </View>
                    <TouchableOpacity style={{ ...styles.searchContainer, flex: 1 }} onPress={handleSearch}>
                        <Ionicons
                            name="search"
                            size={30}
                            color={MATERIAL_COLORS.grey[600]}
                            style={{ width: 28 }}
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={state.sellers}
                    initialNumToRender={100}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item._id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.sellerItem} onPress={() => handleSellerSelect(item)}>
                            <View style={{ ...styles.rowStartContainer, justifyContent: 'space-between' }}>
                                <Text style={styles.sellerName}>{item.name}</Text>
                                <Text style={styles.sellerDistance}>{item.distance}</Text>
                            </View>
                            <View style={styles.rowStartContainer}>
                                <Icon
                                    name="location"
                                    size={40}
                                    color={MATERIAL_COLORS.grey[600]}
                                />
                                <Text style={{ ...styles.sellerAddress, flexWrap: 'wrap' }}>{formatAddress(item.address)}</Text>
                            </View>

                        </TouchableOpacity>
                    )}
                />
            </View>
            <ConfirmDialog
                visible={isDialogVisible}
                title={"Delivery Location Not in Range"}
                description="We're sorry, but your current location is not within our delivery radius. You won't be able to place an order at this time"
                onCancel={handleCancel}
                onConfirm={handleContinue}
            />
            {state.loading && <ProgressDialog isVisible={state.loading} />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        borderRadius: 24,
        borderWidth: 1,
        width: 48,
        marginRight: 8,
        paddingHorizontal: 8,
        marginBottom: 8,
        paddingVertical: 8,
        backgroundColor: MATERIAL_COLORS.grey[1],
        borderColor: MATERIAL_COLORS.grey[300],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1
    },
    greeting: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal
    },
    header: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16
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
    input: {
        backgroundColor: MATERIAL_COLORS.grey[1],
        color: MATERIAL_COLORS.grey[800],
        flex: 1,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    },
    rowStartContainer: {
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: 'flex-start'
    },
    searchBar: {
        alignItems: 'center',
        backgroundColor: MATERIAL_COLORS.grey[1],
        borderColor: MATERIAL_COLORS.grey[300],
        borderRadius: 30,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 8,
        marginHorizontal: 8,
        paddingHorizontal: 16
    },
    sellerAddress: {
        color: MATERIAL_COLORS.grey[800],
        flexWrap: 'wrap',
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
        paddingRight: 20

    },
    sellerDistance: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_medium
    },
    sellerItem: {
        backgroundColor: MATERIAL_COLORS.grey[1],
        borderColor: MATERIAL_COLORS.grey[400],
        borderRadius: 16,
        borderWidth: 0.5,
        elevation: 2,
        flexDirection: 'column',
        marginBottom: 8,
        marginHorizontal: 8,
        paddingLeft: 16,
        paddingRight: 16,
        paddingVertical: 16
    },
    sellerName: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text,
        fontSize: MATERIAL_FONTS_SIZES.font_size_large,
        fontWeight: 'bold'
    },
    serverErrorContainer: {
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    },
    userContainer: {
        alignItems: "flex-start",
        flexDirection: "column",
    },
    userName: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text,
        fontSize: MATERIAL_FONTS_SIZES.font_size_xlarge
    },
    columnContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }
});

export default SearchScreen;
