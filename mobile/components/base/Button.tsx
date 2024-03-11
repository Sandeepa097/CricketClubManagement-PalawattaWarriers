import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  FlexAlignType,
} from 'react-native';
import { Colors } from '../../constants/Colors';

type ButtonLength = 'short' | 'long';

type ButtonStyle = 'filled' | 'outlined';

type ButtonShape = 'circle' | 'square';

type PositioningOptions = {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
};

interface BasicButtonProps {
  sticky?: boolean;
  position?: PositioningOptions;
  color: Colors;
  text?: string;
  onPress: () => void;
  icon?: React.FC;
  style: ButtonStyle;
  borderRadius?: number;
}

interface RectangleButtonProps extends BasicButtonProps {
  length: ButtonLength;
}

interface CircleButtonProps extends BasicButtonProps {
  shape: ButtonShape;
  size: number;
}

const width: number = Dimensions.get('window').width;

const Button = (props: RectangleButtonProps | CircleButtonProps) => {
  const containerStyle: {
    position?: 'absolute';
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    marginBottom?: number;
    shadowColor: Colors;
    shadowOpacity: number;
    elevation: number;
    backgroundColor: Colors;
    borderColor?: Colors;
    borderWidth?: number;
    height: number;
    width: number;
    borderRadius: number;
    display?: 'flex' | 'none';
    alignItems?: FlexAlignType;
    justifyContent?:
      | 'flex-start'
      | 'flex-end'
      | 'center'
      | 'space-between'
      | 'space-around'
      | 'space-evenly';
  } = {
    ...(props.sticky ? { position: 'absolute', ...props.position } : {}),
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
          marginBottom: 10,
          height: 50,
          borderRadius: props.borderRadius || 15,
          width:
            (props as RectangleButtonProps).length === 'long'
              ? 0.944 * width
              : 0.798 * width,
        }
      : {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius:
            (props as CircleButtonProps).shape === 'circle'
              ? (0.139 * width) / 2
              : props.borderRadius || 15,
          height: (props as CircleButtonProps).size,
          width: (props as CircleButtonProps).size,
        }),
  };

  const textStyle: {
    fontFamily: string;
    color: Colors;
    fontSize: number;
    height: number;
    textAlign: 'auto' | 'center' | 'left' | 'right' | 'justify';
    textAlignVertical: 'auto' | 'center' | 'top' | 'bottom';
  } = {
    fontFamily: 'Anybody-Regular',
    color: props.style === 'filled' ? Colors.OFF_WHITE : props.color,
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
      {props.text && !props.icon && (
        <Text style={textStyle}>{props.text.toLocaleUpperCase()}</Text>
      )}
      {props.icon && !props.text && <props.icon />}
    </TouchableOpacity>
  );
};

export default Button;
