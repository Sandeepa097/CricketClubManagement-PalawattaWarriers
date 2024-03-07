import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface PlayerDetailsType {
  id: string | number;
  name: string;
  avatar: string | null;
  score: string;
}

interface CompactMatchItemProps {
  title: string;
  bestBatter: PlayerDetailsType;
  bestBowler: PlayerDetailsType;
  winningPercentage?: number;
}

const width: number = Dimensions.get('window').width;

const CompactMatchItem = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    width: width - 20,
    backgroundColor: Colors.OFF_WHITE,
    padding: 15,
    borderRadius: 15,
  },
});
