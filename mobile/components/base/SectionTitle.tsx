import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

const width: number = Dimensions.get('window').width;

const SectionTitle = ({
  title,
  marginTop = 20,
  fontSize,
  color,
}: {
  title: string;
  marginTop?: number;
  fontSize?: number;
  color?: string;
}) => {
  return (
    <Text
      style={[
        styles.title,
        { marginTop },
        fontSize !== undefined ? { fontSize } : {},
        color !== undefined ? { color } : {},
      ]}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    width: width - 20,
    marginBottom: 15,
    fontFamily: 'Anybody-Regular',
    fontSize: 20,
    color: Colors.DEEP_TEAL,
    textAlign: 'left',
  },
});

export default SectionTitle;
