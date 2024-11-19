import React from 'react';
import { View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIOS } from '../util/helpers';

const Spacer = ({ top = 56 }) => (
  isIOS ? null : <View style={{ marginTop: getStatusBarHeight() }}></View>
);

export default Spacer;
