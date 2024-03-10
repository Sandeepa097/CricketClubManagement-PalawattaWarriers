import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface StrokedTextProps {
  text: string | number;
  color: Colors;
  strokedColor: Colors;
  fontSize: number;
  strokedSize: number;
}

const StrokedText = (props: StrokedTextProps) => {
  const textStyles = {
    fontFamily: 'Anybody-Regular',
    fontSize: props.fontSize,
    color: props.color,
    textShadowColor: props.strokedColor,
    textShadowRadius: 1,
    textShadowOffset: {
      width: props.strokedSize,
      height: props.strokedSize,
    },
  };

  return (
    <View>
      <Text style={[textStyles]}>{props.text}</Text>
      <Text
        style={[
          textStyles,
          styles.stroke,
          {
            textShadowOffset: {
              width: -1 * props.strokedSize,
              height: -1 * props.strokedSize,
            },
          },
        ]}>
        {props.text}
      </Text>
      <Text
        style={[
          textStyles,
          styles.stroke,
          {
            textShadowOffset: {
              width: -1 * props.strokedSize,
              height: props.strokedSize,
            },
          },
        ]}>
        {props.text}
      </Text>
      <Text
        style={[
          textStyles,
          styles.stroke,
          {
            textShadowOffset: {
              width: props.strokedSize,
              height: -1 * props.strokedSize,
            },
          },
        ]}>
        {props.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stroke: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default StrokedText;
