import React from 'react';
import { StyleSheet } from 'react-native';
import { FONT_FAMILY, MATERIAL_COLORS, MATERIAL_FONTS_SIZES } from '../constants';
import { StyledButton, XStack, StyledText } from 'fluent-styles';
import { fontStyles, theme } from '../util/theme';
import { StyledMIcon } from './package/icon';

const MinimumOrder = ({ seller, navigation }) => {

    const Render = () => {

        return (
            <StyledButton borderColor={theme.colors.gray[1]} backgroundColor={theme.colors.gray[1]} onPress={() => navigation.navigate('products')} >
                <XStack flex={1} paddingHorizontal={10} paddingVertical={10} justifyContent="flex-start" alignItems="center">
                    <StyledMIcon size={48} name={"info"} color={theme.colors.blue[500]} />
                    <StyledText flex={1} textAlign='left' fontFamily={fontStyles.Roboto_Regular} fontSize={theme.fontSize.small} color={theme.colors.gray[800]} >Minimum orders for cehckout is {seller.currency}{seller.minimum_delivery_order}. Continue shopping?
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

