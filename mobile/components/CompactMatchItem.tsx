import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../constants/Colors';
import BestPlayersRow from './BestPlayersRow';
import SeriesHighlights from './SeriesHighlights';
import { BestPlayerCard } from '../utils/bestPlayers';

interface CompactMatchItemProps {
  id: string | number;
  title: string;
  bestBatsman: BestPlayerCard | null;
  bestBowler: BestPlayerCard | null;
  bestBatters?: BestPlayerCard[];
  bestBowlers?: BestPlayerCard[];
  bestFielders?: BestPlayerCard[];
  counts?: {
    all: number;
    won: number;
    lost: number;
    draw: number;
  };
  winningPercentage?: number | null;
  onPress: () => void;
  onRequestEdit?: () => void;
  onRequestDelete?: () => void;
}

const width: number = Dimensions.get('window').width;

const CompactMatchItem = (props: CompactMatchItemProps) => (
  <PressableCompactItem {...props} />
);

const PressableCompactItem = (props: CompactMatchItemProps) => {
  const [inPress, setInPress] = useState(false);
  return (
    <Pressable
      style={[
        styles.shadowContainer,
        inPress ? { backgroundColor: 'transparent', opacity: 0.5 } : {},
      ]}
      onPressIn={() => setInPress(true)}
      onPressOut={() => setInPress(false)}
      onPress={() => props.onPress()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{props.title}</Text>
          {(props.winningPercentage || props.winningPercentage === 0) &&
            true && (
              <Text style={styles.title}>{props.winningPercentage}%</Text>
            )}
        </View>
        {props.bestBatters || props.bestBowlers || props.bestFielders ? (
          <SeriesHighlights
            bestBatters={props.bestBatters || []}
            bestBowlers={props.bestBowlers || []}
            bestFielders={props.bestFielders || []}
          />
        ) : (
          <BestPlayersRow
            bestBatsman={props.bestBatsman}
            bestBowler={props.bestBowler}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    paddingLeft: 4,
    paddingBottom: 4,
    borderRadius: 15,
    marginRight: 4,
    marginBottom: 10,
    backgroundColor: Colors.LIGHT_SHADOW,
  },
  container: {
    width: width - 20,
    backgroundColor: Colors.OFF_WHITE,
    padding: 15,
    borderRadius: 15,
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.DEEP_TEAL,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
    fontWeight: 'bold',
  },
});

export default CompactMatchItem;
