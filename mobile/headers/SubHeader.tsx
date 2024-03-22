import React from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import Button from '../components/base/Button';
import { AntDesign } from '@expo/vector-icons';
import { navigationRef } from '../navigation/rootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { setEditing } from '../redux/slices/statusSlice';

const width: number = Dimensions.get('window').width;

const SubHeader = (props: { title: string; onEditTitle?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isEditing = useSelector((state: RootState) => state.status.isEditing);

  return (
    <View style={styles.container}>
      <Button
        shape="circle"
        size={40}
        icon={() => (
          <AntDesign name="caretleft" size={20} color={Colors.OFF_WHITE} />
        )}
        style="filled"
        color={Colors.DEEP_TEAL}
        onPress={() => {
          navigationRef.current.goBack();
          dispatch(setEditing(false));
        }}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.textStyle}>
          {isEditing && props.onEditTitle ? props.onEditTitle : props.title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    height: 66,
    marginBottom: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.LIGHT_TEAL,
    borderBottomColor: '#00000040',
    borderBottomWidth: 4,
  },
  textStyle: {
    fontFamily: 'Anybody-Regular',
    fontSize: 32,
    color: Colors.DEEP_TEAL,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});

export default SubHeader;
