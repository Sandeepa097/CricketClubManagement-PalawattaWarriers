import React from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const LoadingIndicator = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    zIndex: 10,
    height: height,
    width: width,
    backgroundColor: 'transparent',
  },
});

export default LoadingIndicator;
