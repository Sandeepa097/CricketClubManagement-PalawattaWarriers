import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, Text, Modal } from 'react-native';
import { Colors } from '../constants/Colors';
import Logo from '../assets/Logo';
import Button from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const width: number = Dimensions.get('window').width;

const MainHeader = (props) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const onPress = () => setOptionsVisible(!optionsVisible);
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Logo height={52} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.textStyle}>{props.title}</Text>
        </View>
      </View>
      <Button
        shape="circle"
        size={52}
        icon={() => (
          <MaterialCommunityIcons
            name="face-man-outline"
            size={24}
            color={Colors.OFF_WHITE}
          />
        )}
        style="filled"
        color={Colors.DEEP_TEAL}
        onPress={onPress}
      />
      {/* <Modal visible={optionsVisible} transparent={true}>
        <View
          style={{
            height: 50,
            width: 50,
            position: 'absolute',
            top: 62,
            right: 10,
            backgroundColor: 'green',
          }}>
          <Text>Modal</Text>
        </View>
      </Modal> */}
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
    height: 66,
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.LIGHT_TEAL,
    borderBottomColor: '#00000040',
    borderBottomWidth: 4,
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
    textAlignVertical: 'center',
  },
});

export default MainHeader;
