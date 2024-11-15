import React from 'react';
import { View } from 'react-native';
import { isIOS } from '../util/helpers';

const Spacer = ({ top = 28 }) => (
  isIOS ? null : <View style={{ marginTop: top }}></View>
);

export default Spacer;
