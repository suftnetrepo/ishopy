/* eslint-disable react/display-name */
import React from 'react';
import { StatusBar as StatusBarRN, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { isIOS } from '../util/helpers';
import { MATERIAL_COLORS } from '../constants';

const StatusBar = React.memo(() => {
  return <StatusBarRN translucent backgroundColor={MATERIAL_COLORS.grey[100]} barStyle='dark-content' />
});

export default StatusBar;

const styles = StyleSheet.create({
  statusbarWrapper: {
    backgroundColor: MATERIAL_COLORS.grey[100],
    width: "100%"
  }
})
