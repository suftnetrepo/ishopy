/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { percentage } from '../util/helpers'

const ProgressBar = ({ targetAmount, currentAmount }) => {
  const progressPercent = percentage(currentAmount , targetAmount);

  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${progressPercent}%` }]}>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    alignItems: 'center',
    backgroundColor: '#4caf50',
    height: '100%',
    justifyContent: 'center',
    textAlign: 'center',
  },
  progressBarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressContainer: {
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    height: 5,
    overflow: 'hidden',
    width: '100%',
  },
});

export default ProgressBar;
