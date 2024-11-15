import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
    MATERIAL_COLORS,
    MATERIAL_FONTS_SIZES,
    FONT_FAMILY
} from '../constants';
import ProgressDialog from "../components/ProgressDialog";
import { Dropdown } from "react-native-element-dropdown";
import { fetchAddress } from '../api';
import { StyledSearchBar } from './package/searchBar';

const SearchBar = ({ handleSelectedAddress }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = async (searchQuery) => {
        try {
            if (searchQuery) {
                setLoading(true)
                const { data, success } = await fetchAddress(searchQuery)

                if (success) {
                    setSuggestions(data.map((item) => ({
                        label: item.display_name,
                        value: item.place_id,
                    })));
                    setSearchResults(data);
                }
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false)
        }
    };

    const reset=()=>{
        setSearchResults([])
    }

    const handleAddress = (place_id) => {
        const results = searchResults.find(
            (a) => a.place_id === parseFloat(place_id),
        );      
        handleSelectedAddress(results);       
    }

    return (
        <View>
            <StyledSearchBar backgroundColor={MATERIAL_COLORS.grey[1]} onReset={()=> reset()} placeholder='Search for by name, address ...' onPress={(searchQuery)=> handleSearch(searchQuery)} />
            {
                searchResults.length > 0 && (
                    <View style={styles.dropDownInput}>
                        <Dropdown
                            style={{ ...styles.inputText, height: 50 }}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={suggestions}
                            search={false}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select address suggestions"
                            onChange={(address) =>
                                handleAddress(address.value)
                            }
                        />
                    </View>
                )
            }
            {loading && <ProgressDialog isVisible={loading} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    dropDownInput: {
        alignItems: "center",
        backgroundColor: MATERIAL_COLORS.grey[1],
        borderColor: MATERIAL_COLORS.grey[500],
        borderRadius: 30,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
        paddingHorizontal: 20,
    },
    flexContainer: {
        flex: 1
    },
    iconStyle: {
        height: 20,
        width: 20,
    },
    input: {
        flex: 1,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
        height: 40
    },
    inputText: {
        color: MATERIAL_COLORS.grey[900],
        flex: 1,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    },
    label: {
        color: MATERIAL_COLORS.grey[800],
        fontFamily: FONT_FAMILY.crimson_text_regular,
        fontSize: MATERIAL_FONTS_SIZES.font_size_normal,
    },
    placeholder: {
        color: MATERIAL_COLORS.grey[600],
    },
    placeholderStyle: {
        color: MATERIAL_COLORS.grey[500],
        fontFamily: FONT_FAMILY.crimson_text_regular,
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
        borderColor: MATERIAL_COLORS.grey[500],
        borderRadius: 30,
        borderWidth: 1,
        flexDirection: 'row',
        marginBottom: 4,
        paddingHorizontal: 16,
    },
    selectTextStyle: {
        borderColor: MATERIAL_COLORS.grey[300],
        borderWidth: 1,
        fontSize: 16,
    },
    selectedStyle: {

    },
    selectedTextColor: {
        color: MATERIAL_COLORS.grey[500],
    },
    selectedTextStyle: {
        fontSize: 16,
    },
})

export default SearchBar;
