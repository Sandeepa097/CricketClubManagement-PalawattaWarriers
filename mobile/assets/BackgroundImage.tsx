import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const width: number = Dimensions.get('screen').width;
const height: number = Dimensions.get('screen').height;

const BackgroundImage = () => (
  <View style={styles.container}>
    <Svg
      width="100%"
      height="100%"
      viewBox={`0 0 360 800`}
      preserveAspectRatio="xMidYMid meet"
      fill="none">
      <Path
        d="M953 400C953 689.949 717.949 925 428 925C138.051 925 -97 689.949 -97 400C-97 110.051 138.051 -125 428 -125C717.949 -125 953 110.051 953 400Z"
        fill="#73B7A8"
      />
      <Path
        d="M878 400C878 648.528 676.528 850 428 850C179.472 850 -22 648.528 -22 400C-22 151.472 179.472 -50 428 -50C676.528 -50 878 151.472 878 400Z"
        fill="#86C0B2"
      />
      <Path
        d="M803 400C803 607.107 635.107 775 428 775C220.893 775 53 607.107 53 400C53 192.893 220.893 25 428 25C635.107 25 803 192.893 803 400Z"
        fill="#97C9BD"
      />
      <Path
        d="M728 400C728 565.685 593.685 700 428 700C262.315 700 128 565.685 128 400C128 234.315 262.315 100 428 100C593.685 100 728 234.315 728 400Z"
        fill="#A9D2C8"
      />
      <Path
        d="M642 400C642 524.264 541.264 625 417 625C292.736 625 192 524.264 192 400C192 275.736 292.736 175 417 175C541.264 175 642 275.736 642 400Z"
        fill="#BADBD2"
      />
      <Path
        d="M567 400C567 482.843 499.843 550 417 550C334.157 550 267 482.843 267 400C267 317.157 334.157 250 417 250C499.843 250 567 317.157 567 400Z"
        fill="#CBE4DD"
      />
      <Path
        d="M492 404C492 445.421 458.421 479 417 479C375.579 479 342 445.421 342 404C342 362.579 375.579 329 417 329C458.421 329 492 362.579 492 404Z"
        fill="#DDEDE9"
      />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    height: height,
    width: width,
    backgroundColor: '#60AE9D',
  },
});

export default BackgroundImage;
