import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import Logo from '../assets/Logo';
import Button from '../components/base/Button';
import { MaterialIcons } from '@expo/vector-icons';
import ConfirmBox from '../components/base/ConfirmBox';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';
import { UserTypes } from '../constants/UserTypes';

const width: number = Dimensions.get('window').width;

const MainHeader = (props: { title: string }) => {
  const userType = useSelector((state: RootState) => state.auth.userType);
  const dispatch = useDispatch<AppDispatch>();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const onPress = () => {
    if (userType === UserTypes.GUEST) dispatch(logout());
    else setOptionsVisible(!optionsVisible);
  };

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
          <MaterialIcons name="logout" size={24} color={Colors.OFF_WHITE} />
        )}
        style="filled"
        color={Colors.DEEP_TEAL}
        onPress={onPress}
      />
      <ConfirmBox
        visible={optionsVisible}
        title="Are you sure you want to logout?"
        ok={{
          text: 'Logout',
          onPress: () => {
            setOptionsVisible(false);
            dispatch(logout());
          },
        }}
        cancel={{ text: 'Cancel', onPress: () => setOptionsVisible(false) }}
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
    color: Colors.DEEP_TEAL,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});

export default MainHeader;
