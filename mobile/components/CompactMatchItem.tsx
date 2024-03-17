import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../constants/Colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from '../assets/Logo';

interface PlayerDetailsType {
  id: string | number;
  name: string;
  avatar?: string | null;
  score: string;
}

interface CompactMatchItemProps {
  id: string | number;
  title: string;
  bestBatsman: PlayerDetailsType | null;
  bestBowler: PlayerDetailsType | null;
  counts?: {
    all: number;
    won: number;
    lost: number;
    draw: number;
  };
  winningPercentage?: number | null;
  onPress: () => void;
}

interface BestPlayerContainerProps extends PlayerDetailsType {
  roll: 'batsman' | 'bowler';
}

const width: number = Dimensions.get('window').width;

const CompactMatchItem = (props: CompactMatchItemProps) => {
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
          {props.winningPercentage !== null && (
            <Text style={styles.title}>{props.winningPercentage}%</Text>
          )}
        </View>
        <View style={styles.bestPlayersContainer}>
          {props.bestBatsman !== null && (
            <BestPlayerContainer {...props.bestBatsman} roll="batsman" />
          )}
          {props.bestBowler !== null && (
            <BestPlayerContainer {...props.bestBowler} roll="bowler" />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const BestPlayerContainer = (props: BestPlayerContainerProps) => {
  return (
    <View style={styles.singleBestPlayerContainer}>
      <View style={{ width: (width - 60) / 2 - 60 }}>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{props.score}</Text>
          {props.roll === 'batsman' ? (
            <MaterialCommunityIcons
              name="cricket"
              size={20}
              color={Colors.BLACK}
            />
          ) : (
            <Ionicons name="tennisball" size={20} color={Colors.BLACK} />
          )}
        </View>
        <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
          {props.name}
        </Text>
      </View>
      <View style={styles.avatarContainer}>
        <Logo height={30} />
      </View>
    </View>
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
  bestPlayersContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  singleBestPlayerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: (width - 60) / 2,
    borderRadius: 10,
    backgroundColor: Colors.AMBER,
    padding: 10,
  },
  scoreContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    color: Colors.BLACK,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
    fontWeight: 'bold',
    marginRight: 5,
  },
  name: {
    color: Colors.BLACK,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: width / 2,
    backgroundColor: Colors.OFF_WHITE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CompactMatchItem;
