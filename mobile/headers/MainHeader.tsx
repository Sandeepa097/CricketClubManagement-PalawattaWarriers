import React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import Logo from '../assets/Logo';
import Button from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const width: number = Dimensions.get('window').width;

const ProfileIcon = () => {
  return (
    <MaterialCommunityIcons
      name="face-man-outline"
      size={24}
      color={Colors.OFF_WHITE}
    />
  );
};

const MainHeader = (props) => {
  const onPress = () => console.log('Profile pressed');
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Logo height={52} width={0.657 * 52} />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.textStyle}>{props.title}</Text>
        </View>
      </View>
      <Button
        shape="circle"
        size={52}
        icon={ProfileIcon}
        style="filled"
        color={Colors.DEEP_TEAL}
        onPress={onPress}
      />
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
