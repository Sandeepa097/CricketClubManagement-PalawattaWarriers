import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface TextInputProps {
  placeholder: string;
  value: boolean;
  onChangeValue: () => void;
}

const width: number = Dimensions.get('window').width;

const SwitchInput = (props: TextInputProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={props.onChangeValue}>
      <TextInput
        style={styles.input}
        editable={false}
        placeholder={props.placeholder}
      />
      <Switch value={props.value} onChange={props.onChangeValue} />
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
  input: {
    flex: 1,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.DEEP_TEAL,
    textAlignVertical: 'center',
  },
});

export default SwitchInput;
