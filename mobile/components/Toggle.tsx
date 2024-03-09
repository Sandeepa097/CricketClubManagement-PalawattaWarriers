import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';

interface ToggleSideProps {
  id: number | string;
  name: string;
}

interface ToggleProps {
  left: ToggleSideProps;
  right: ToggleSideProps;
  onPress: (id: string | number) => void;
}

const width: number = Dimensions.get('window').width;

const Toggle = (props: ToggleProps) => {
  const [isToggleLeft, setIsToggleLeft] = useState(true);
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      onPress={() => {
        props.onPress(isToggleLeft ? props.right.id : props.left.id);
        setIsToggleLeft(!isToggleLeft);
      }}>
      <Text style={styles.name}>
        {isToggleLeft ? props.left.name : props.right.name}
      </Text>
      <Feather
        name={isToggleLeft ? 'toggle-left' : 'toggle-right'}
        size={30}
        color={Colors.DEEP_TEAL}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: width - 20,
    height: 42,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    backgroundColor: Colors.OFF_WHITE,
    marginVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.DEEP_TEAL,
  },
});

export default Toggle;
