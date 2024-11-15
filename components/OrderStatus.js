import React, {useState} from 'react';
import {ORDER_STATUS} from '../constants';

import {
  XStack,
  StyledText,
  StyledButton,
  StyledCycle,
  StyledSpacer,
  YStack,
} from 'fluent-styles';
import {ScrollView} from 'react-native';

import {fontStyles} from '../util/fontStyles';
import {theme} from '../util/theme';
import {StyledMIcon} from './package/icon';

const OrderStatus = ({onPress}) => {
  const [selected, setSelected] = useState('-1');

  const handleSelect = status => {
    setSelected(status);
    onPress && onPress(status);
  };

  return (
    <YStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack
          paddingHorizontal={8}
          backgroundColor={theme.colors.transparent}
          paddingVertical={6}>
          {ORDER_STATUS.map((status, index) => {
            return (
              <XStack key={index}>
                <StyledButton
                  borderColor={theme.colors.green[600]}
                  backgroundColor={theme.colors.gray[100]}
                  onPress={() => handleSelect(status)}>
                  <XStack
                    paddingHorizontal={6}
                    paddingVertical={5}
                    key={index}
                    justifyContent="flex-start"
                    alignItems="center">
						{
							selected === status && (
								<StyledCycle
								borderWidth={1}
								height={30}
								width={30}
								borderColor={theme.colors.gray[200]}
								backgroundColor={theme.colors.gray[800]}>
								<StyledMIcon
								  size={24}
								  name={'check'}
								  color={theme.colors.gray[1]}
								/>
							  </StyledCycle>
							)
						}
                   
                    <StyledSpacer marginHorizontal={1} />
                    <StyledText
                      fontFamily={fontStyles.Roboto_Regular}
                      fontSize={theme.fontSize.small}
                      color={theme.colors.gray[800]}>
                      {status}
                    </StyledText>
                  </XStack>
                </StyledButton>
                <StyledSpacer marginHorizontal={4} />
              </XStack>
            );
          })}
        </XStack>
      </ScrollView>
    </YStack>
  );
};

export default OrderStatus;
