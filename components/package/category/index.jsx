/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { XStack, StyledText, StyledButton, StyledCycle, StyledSpacer } from 'fluent-styles';
import { ScrollView } from "react-native";
import { StyledMIcon } from "../icon";
import { fontStyles, theme } from "../../../util/theme";

const CategoryScrollView = ({ onPress, categories = [] }) => {
    const [selected, setSelected] = useState("-1")

    const handleSelect = (category) => {
        setSelected(category._id)
        onPress && onPress(category)
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack paddingHorizontal={8} backgroundColor={theme.colors.transparent} paddingVertical={6} >
                {
                    categories.map((category, index) => {

                        return (
                            <XStack key={index} >
                                <StyledButton borderColor={theme.colors.green[600]} backgroundColor={theme.colors.gray[100]} onPress={() => handleSelect(category)} >
                                    <XStack paddingHorizontal={10} paddingVertical={10} key={index} justifyContent="flex-start" alignItems="center">
                                        {
                                            selected === category._id &&  (
                                                <StyledCycle borderWidth={1} height={30} width={30} borderColor={theme.colors.green[600]} backgroundColor={theme.colors.green[600]}>
                                                <StyledMIcon size={24} name={ "check"} color={theme.colors.gray[1]} />
                                            </StyledCycle>
                                            )
                                        }
                                      
                                        <StyledText paddingHorizontal={2} fontFamily={fontStyles.c} fontSize={theme.fontSize.normal} color={theme.colors.gray[800]} >{category.name}</StyledText>
                                    </XStack>
                                </StyledButton>
                                <StyledSpacer marginHorizontal={4} />
                            </XStack>
                        )
                    }
                    )
                }
            </XStack>
        </ScrollView>
    )
}

export default CategoryScrollView 