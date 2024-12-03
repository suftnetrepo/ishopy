import React from 'react';
import { StyleSheet } from 'react-native';
import { FONT_FAMILY, MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from '../constants';
import { StyledButton, XStack, StyledText } from 'fluent-styles';
import { fontStyles, theme } from '../util/theme';
import { StyledMIcon } from './package/icon';

const MinimumOrder = ({ seller, navigation }) => {

    const Render = () => {

        return (
            <StyledButton borderRadius={50} borderColor={theme.colors.cyan[500]} backgroundColor={theme.colors.cyan[500]} onPress={() => navigation.navigate('products')} >
                <XStack flex={1} paddingHorizontal={10} paddingVertical={10} justifyContent="flex-start" alignItems="center">
                    <StyledMIcon size={48} name={"info"} color={theme.colors.gray[1]} />
                    <StyledText flex={1} textAlign='center' fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.medium} color={theme.colors.gray[1]} >Order must be {seller.currency}{seller.minimum_delivery_order} or more. Continue shopping?
                    </StyledText>
                </XStack>
            </StyledButton>
        )
    }
    return (
        <Render />
    );
};

export default MinimumOrder;

