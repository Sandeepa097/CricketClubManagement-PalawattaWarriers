import React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import Logo from '../assets/Logo';

const width: number = Dimensions.get('window').width;

const MainHeader = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Logo height={50} width={0.657 * 50} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.textStyle}>{props.title}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width,
    height: 70,
    padding: 10,
    backgroundColor: Colors.LIGHT_TEAL,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: 'Anybody-Regular',
    fontSize: 32,
    color: Colors.BLACK,
  },
});

export default MainHeader;
