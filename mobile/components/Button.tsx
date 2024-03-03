import React from 'react';
import { TouchableOpacity, View, Text, Dimensions } from 'react-native';
import { Colors } from '../constants/Colors';

type ButtonLength = 'short' | 'long';

type ButtonStyle = 'filled' | 'outlined';

type ButtonShape = 'circle';

type ButtonSize = 'small' | 'large';

interface RectangleButtonProps {
  length: ButtonLength;
  style: ButtonStyle;
  color: Colors;
  text: string;
  onPress: () => void;
}

interface CircleButtonProps {
  shape: ButtonShape;
  size: ButtonSize;
  color: Colors;
  style: ButtonStyle;
  text: string;
  onPress: () => void;
}

const width: number = Dimensions.get('window').width;

const Button = (props: RectangleButtonProps | CircleButtonProps) => {
  const containerStyle = {
    marginBottom: 10,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.25,
    elevation: 4,
    ...(props.style === 'filled'
      ? { backgroundColor: props.color }
      : {
          backgroundColor: Colors.OFF_WHITE,
          borderColor: props.color,
          borderWidth: 1,
        }),
    ...(props.hasOwnProperty('length')
      ? {
          height: 50,
          borderRadius: 15,
          width:
            (props as RectangleButtonProps).length === 'long'
              ? 0.944 * width
              : 0.798 * width,
        }
      : {
          borderRadius: (0.139 * width) / 2,
          ...((props as CircleButtonProps).size === 'large'
            ? {
                height: 0.139 * width,
                width: 0.139 * width,
              }
            : {
                height: 0.117 * width,
                width: 0.117 * width,
              }),
        }),
  };

  const textStyle: {
    color: Colors;
    fontFamily: string;
    fontSize: number;
    height: number;
    textAlign: 'auto' | 'center' | 'left' | 'right' | 'justify';
    textAlignVertical: 'auto' | 'center' | 'top' | 'bottom';
  } = {
    color: props.style === 'filled' ? Colors.OFF_WHITE : props.color,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    height: props.hasOwnProperty('length') ? 50 : 0.139 * width,
    textAlign: 'center',
    textAlignVertical: 'center',
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      activeOpacity={0.5}
      onPress={props.onPress}>
      <Text style={textStyle}>{props.text.toLocaleUpperCase()}</Text>
    </TouchableOpacity>
  );
};

export default Button;
