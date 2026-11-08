import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import Logo from '../assets/Logo';
import { BestPlayerCard } from '../utils/bestPlayers';

interface BestPlayersRowProps {
  bestBatsman: BestPlayerCard | null;
  bestBowler: BestPlayerCard | null;
}

interface BestPlayerChipProps extends BestPlayerCard {
  roll: 'batsman' | 'bowler' | 'fielder';
  position?: number;
}

const width: number = Dimensions.get('window').width;

const BestPlayersRow = ({ bestBatsman, bestBowler }: BestPlayersRowProps) => {
  if (!bestBatsman && !bestBowler) {
    return null;
  }

  return (
    <View style={styles.bestPlayersContainer}>
      {bestBatsman ? (
        <BestPlayerChip {...bestBatsman} roll="batsman" />
      ) : null}
      {bestBowler ? <BestPlayerChip {...bestBowler} roll="bowler" /> : null}
    </View>
  );
};

export const BestPlayerChip = (props: BestPlayerChipProps) => (
  <View style={styles.singleBestPlayerContainer}>
    {props.position ? (
      <View style={styles.rankBadge} accessibilityLabel={`Rank ${props.position}`}>
        <Text style={styles.rankText}>{props.position}</Text>
      </View>
    ) : null}
    <View style={{ width: (width - 60) / 2 - (props.position ? 84 : 60) }}>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{props.score}</Text>
        {props.roll === 'batsman' ? (
          <MaterialCommunityIcons name="cricket" size={20} color={Colors.BLACK} />
        ) : props.roll === 'bowler' ? (
          <Ionicons name="tennisball" size={20} color={Colors.BLACK} />
        ) : (
          <MaterialCommunityIcons
            name="hand-front-right"
            size={20}
            color={Colors.BLACK}
          />
        )}
      </View>
      <Text style={styles.name} ellipsizeMode="tail" numberOfLines={1}>
        {props.name}
      </Text>
    </View>
    <View style={styles.avatarContainer}>
      {!props.avatar ? (
        <Logo height={30} />
      ) : (
        <Image
          source={{ uri: props.avatar }}
          style={{ height: 40, width: 40, borderRadius: 20 }}
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
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
  rankBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.DEEP_TEAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  rankText: {
    color: Colors.OFF_WHITE,
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Anybody-Regular',
    fontWeight: 'bold',
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

export default BestPlayersRow;
