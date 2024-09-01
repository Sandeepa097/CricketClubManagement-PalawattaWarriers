import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/Colors';

const width: number = Dimensions.get('window').width;

interface ClickableInputProps {
  containerStyle?: ViewStyle;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onPress: () => void;
  icon?: React.FC;
}

const ClickableInput = (props: ClickableInputProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        props.containerStyle ? { ...props.containerStyle } : {},
        props.disabled ? { ...styles.disabled } : {},
      ]}
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
  disabled: {
    backgroundColor: 'transparent',
  },
  text: {
    flex: 1,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.DEEP_TEAL,
    textAlignVertical: 'center',
  },
});

export default ClickableInput;
