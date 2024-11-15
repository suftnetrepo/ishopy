/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { styled, StyledSpacer, isValidColor, StyledCycle, isValidNumber, InputText } from 'fluent-styles';
import { theme } from "../../../util/theme";
import { StyledMIcon } from "../icon";
import { View } from "react-native";

const SearchBar = styled(View, {
    base: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 1,
        paddingHorizontal: 1,
        height: 50,
        borderRadius: 100,
        backgroundColor: theme.colors.gray[1],
    },
    variants: {
        borderColor: color => {
            if (!color) return
            if (!isValidColor(color)) {
                throw new Error('Invalid color value')
            }
            return { borderColor: color }
        },
        borderRadius: (size = 32) => {
            if (!isValidNumber(size)) {
                throw new Error('Invalid borderRadius value')
            }
            return { borderRadius: size }
        },
        backgroundColor: color => {
            if (!color) return
            if (!isValidColor(color)) {
                throw new Error('Invalid color value')
            }
            return { backgroundColor: color }
        }
    }
})

const StyledSearchBar = ({ size = 24, name = 'search', placeholder = 'Search by seller name', onReset, onPress, ...rest }) => {
    const [searchQuery, setSearchQuery] = useState();

    const handleSubmit = () => {
        if (onPress && searchQuery) {
            onPress(searchQuery)
        }
    }

    return (
        <SearchBar borderWidth={1} borderColor={theme.colors.gray[50]} {...rest}>
            {
                searchQuery && (
                    <StyledCycle borderWidth={1} borderColor={theme.colors.gray[1]} backgroundColor={theme.colors.gray[50]}>
                        {
                            <StyledMIcon size={48} name={'cancel'} color={theme.colors.gray[800]} onPress={() =>{ 
                                onReset && onReset()
                                setSearchQuery() }} />
                        }
                    </StyledCycle>
                )
            }
            <InputText flex={1} placeholder={placeholder} fontSize={theme.fontSize.normal} value={searchQuery}
                onChangeText={setSearchQuery} returnKeyType='search' noBorder={true} onSubmitEditing={handleSubmit} />
            <StyledSpacer marginHorizontal={2} />
            <StyledCycle height={48} width={48} borderWidth={1} borderColor={theme.colors.cyan[400]} backgroundColor={theme.colors.cyan[500]}>
                {
                    <StyledMIcon size={size} name={name} color={theme.colors.gray[1]} onPress={() => handleSubmit()} />
                }
            </StyledCycle>
        </SearchBar>
    )
}

export { StyledSearchBar }