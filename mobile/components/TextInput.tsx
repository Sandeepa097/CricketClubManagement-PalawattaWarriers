import React, { useState } from 'react';
import ReactNative, { View, Dimensions, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type InputLength = 'short' | 'long';

type InputType = 'text' | 'password';

interface TextInputProps {
  length: InputLength;
  placeholder: string;
  type?: InputType;
  value: string | null;
  maxLength?: number;
  onChangeText: (text: string) => void;
}

const TextInput = (props: TextInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const width: number = Dimensions.get('window').width;

  return (
    <View
      style={[
        styles.container,
        { width: props.length === 'long' ? 0.944 * width : 0.798 * width },
      ]}>
      <ReactNative.TextInput
        style={styles.input}
        editable
        secureTextEntry={props.type === 'password' && !isPasswordVisible}
        maxLength={props.maxLength || 50}
        onChangeText={(text) => props.onChangeText(text)}
        value={props.value}
        placeholder={props.placeholder}
      />
      {props.type === 'password' && (
        <ReactNative.Pressable
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <MaterialCommunityIcons
            name={isPasswordVisible ? 'eye' : 'eye-off'}
            size={24}
            color={Colors.DEEP_TEAL}
          />
        </ReactNative.Pressable>
      )}
    </View>
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
  },
  input: {
    flex: 1,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.DEEP_TEAL,
    textAlignVertical: 'center',
  },
});

export default TextInput;
