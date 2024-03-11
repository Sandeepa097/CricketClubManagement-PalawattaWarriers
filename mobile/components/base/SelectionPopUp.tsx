import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/Colors';

const width: number = Dimensions.get('window').width;

interface SelectionPopUp {
  placeholder: string;
  value: string;
  onPress: () => void;
  icon?: React.FC;
}

const SelectionPopUp = (props: SelectionPopUp) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={props.onPress}>
      <TextInput
        style={styles.text}
        editable={false}
        placeholder={props.placeholder}
        value={props.value}
      />
      {props.icon !== undefined && <props.icon />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.DEEP_TEAL,
    backgroundColor: Colors.OFF_WHITE,
    marginBottom: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 20,
  },
  text: {
    flex: 1,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.DEEP_TEAL,
    textAlignVertical: 'center',
  },
});

export default SelectionPopUp;
