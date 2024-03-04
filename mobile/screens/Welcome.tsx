import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import LogoWithName from '../assets/LogoWithName';
import { Colors } from '../constants/Colors';
import Button from '../components/Button';
import { NavigationRoutes } from '../constants/NavigationRoutes';

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const Welcome = ({ navigation }) => {
  const continueAsGuest = () => console.log('Continue as guest');

  const adminPortal = () => navigation.navigate(NavigationRoutes.LOGIN);

  return (
    <View style={styles.container}>
      <LogoWithName width={0.419 * width} height={0.194 * height} />
      <View style={styles.divider}></View>
      <Button
        length="short"
        style="filled"
        color={Colors.DEEP_TEAL}
        text="Continue as Guest"
        onPress={continueAsGuest}
      />
      <Button
        length="short"
        style="outlined"
        color={Colors.DEEP_TEAL}
        text="Admin Portal"
        onPress={adminPortal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  divider: {
    marginTop: 0.043 * height,
    marginBottom: 0.043 * height,
    width: 0.798 * width,
    height: 1,
    backgroundColor: Colors.WHITE,
  },
});

export default Welcome;
