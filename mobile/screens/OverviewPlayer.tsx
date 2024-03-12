import React from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native';
import SectionTitle from '../components/base/SectionTitle';
import PlayerItem from '../components/PlayerItem';
import { Colors } from '../constants/Colors';

interface PlayerStatProps {
  header: string;
  body: string;
  value: string | number;
}

const width: number = Dimensions.get('window').width;

const PlayerStat = (props: PlayerStatProps) => {
  return (
    <View style={styles.playerStatContainer}>
      <View>
        <Text style={styles.header}>{props.header}</Text>
        <Text style={styles.body}>{props.body}</Text>
      </View>
      <Text style={styles.value}>{props.value}</Text>
    </View>
  );
};

const OverviewPlayer = ({ route }) => {
  const playerDetails = route.params;
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <SectionTitle title="Player Details" marginTop={10} />
        <PlayerItem
          flat
          verticalSpaceBetweenText={10}
          avatarSize={60}
          {...playerDetails}
        />
        <SectionTitle title="Player Stats" />
        <PlayerStat
          header="Best Batting Score"
          body="Vs Australia"
          value="77*"
        />
        <PlayerStat header="Strike Rate" body="Average" value="145.67" />
        <PlayerStat header="Best Bowling Score" body="Average" value="4/56" />
        <PlayerStat header="Economy" body="Average" value="7.43" />
        <PlayerStat header="Matches" body="PPL" value="24" />
        <PlayerStat header="Matches" body="Outdoor" value="12" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  playerStatContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 20,
    backgroundColor: Colors.MEDIUM_TEAL,
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  header: {
    color: Colors.OFF_WHITE,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
  body: {
    color: Colors.OFF_WHITE,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
    marginTop: 10,
  },
  value: {
    color: Colors.OFF_WHITE,
    fontSize: 24,
    fontFamily: 'Anybody-Regular',
  },
});

export default OverviewPlayer;
