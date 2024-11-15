import React from "react"
import { YStack, XStack, StyledSpacer, StyledText } from 'fluent-styles';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import { useCurrentLocation } from "./hooks/useCurrentLocation"
import { fontStyles } from "../util/fontStyles";
import { theme } from "../util/theme";

const MyCurrentLocation = () => {
    const { data} = useCurrentLocation()
   
    return (
        <YStack justifyContent='flex-start'
            alignItems='flex-start'>
            <StyledText
                fontFamily={fontStyles.Roboto_Regular}
                fontWeight={theme.fontWeight.normal}
                color={theme.colors.gray[800]}
                fontSize={theme.fontSize.nano}
            >
                Your Current location
            </StyledText>
            <XStack justifyContent='flex-start'
                paddingVertical={2}
                alignItems='center'>
                <Ionicons
                    name="location-pin"
                    size={16}
                    color={theme.colors.gray[600]}
                />
         		<StyledSpacer marginHorizontal={1} />
                <StyledText
                    fontFamily={fontStyles.Roboto_Regular}
                    fontWeight={theme.fontWeight.normal}
                    color={theme.colors.gray[500]}
                    fontSize={theme.fontSize.nano}
                >
                    {data?.city}, {data?.country}
                </StyledText>
            </XStack>
        </YStack>
    )
}

export default React.memo(MyCurrentLocation)