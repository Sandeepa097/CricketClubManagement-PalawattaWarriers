import React, { useState } from 'react';
import ReactNative, { View, Dimensions, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type InputLength = 'short' | 'long' | number;

type InputType = 'text' | 'password';

interface TextInputProps {
  name?: string;
  length: InputLength;
  placeholder: string;
  type?: InputType;
  value: string | null;
  maxLength?: number;
  error?: string;
  onChangeText: (text: string) => void;
  onBlur: (event: any) => void;
}

const TextInput = (props: TextInputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const width: number = Dimensions.get('window').width;

  return (
    <View style={{ marginBottom: 10 }}>
      <View
        style={[
          styles.container,
          {
            width:
              props.length === 'long'
                ? width - 20
                : props.length === 'short'
                ? 0.798 * width
                : props.length,
          },
        ]}>
        <ReactNative.TextInput
          style={styles.input}
          editable
          secureTextEntry={props.type === 'password' && !isPasswordVisible}
          maxLength={props.maxLength || 50}
          onChangeText={(text) => props.onChangeText(text)}
          onBlur={props.onBlur}
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
      {props.error && true && <Text style={styles.error}>{props.error}</Text>}
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
  error: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_ORANGE,
  },
});

export default TextInput;
