import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { fontStyles, theme } from '../util/theme';

const SliderWithKnobLabel = ({onSlidingComplete}) => {
  const [sliderValue, setSliderValue] = useState(20);
  const [knobPosition, setKnobPosition] = useState(0);

  const calculateKnobPosition = (value) => {
    const newPosition = ((value / 100) * (styles.slider.width - 28)) + 14; 
    setKnobPosition(newPosition);
  };

  useEffect(()=> {
    calculateKnobPosition(sliderValue)
  },[sliderValue])

  const handleValueChange = (value) => {
    setSliderValue(value);
    calculateKnobPosition(value)
  };

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={sliderValue}
        onValueChange={handleValueChange}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor={theme.colors.cyan[500]}
        maximumTrackTintColor={theme.colors.gray[500]}
        thumbTintColor={theme.colors.pink[600]}
        step={1}
      />
      <View style={[styles.knobLabel, { left: knobPosition }]}>
        <Text style={styles.knobText}>{sliderValue.toFixed(0)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,  
  },
  slider: {
    width: 300,
    height: 40,
  },
  knobLabel: {
    position: 'absolute',
    top: -2,  
    minWidth: 40,
    alignItems: 'center',
  },
  knobText: {
    fontFamily : fontStyles.Roboto_Regular,
    color: theme.colors.gray[1],
    fontWeight: theme.fontWeight.extraBold,
    backgroundColor: theme.colors.cyan[800],
    padding: 8,
    borderRadius: 14,
  },
});

export default SliderWithKnobLabel;
