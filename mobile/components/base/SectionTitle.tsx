import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

const width: number = Dimensions.get('window').width;

const SectionTitle = ({
  title,
  marginTop = 20,
}: {
  title: string;
  marginTop?: number;
}) => {
  return <Text style={[styles.title, { marginTop: marginTop }]}>{title}</Text>;
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
