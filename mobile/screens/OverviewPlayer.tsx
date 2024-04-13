import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native';
import SectionTitle from '../components/base/SectionTitle';
import PlayerItem from '../components/PlayerItem';
import { Colors } from '../constants/Colors';
import api from '../api';

interface PlayerStatProps {
  header: string;
  body: string;
  value: string | number;
}

interface PlayerMatchStatResponse {
  battingStats: {
    bestScore?: {
      score: number;
      balls: number;
      isOut: boolean;
      match: {
        date: string;
        location: string;
        oppositeTeam?: {
          name: string;
        };
      };
    };
    averageStrikeRate?: number;
    totalScore?: number;
    totalBalls?: number;
    dismissedCount?: number;
  };
  bowlingStats: {
    bestScore?: {
      conceded: number;
      wickets: number;
      match: {
        date: string;
        location: string;
        oppositeTeam?: {
          name: string;
        };
      };
    };
    averageEconomy?: number;
    totalWickets?: number;
    totalConceded?: number;
  };
  matchesCount: number;
}

interface PlayerStatsResponse {
  outdoor: PlayerMatchStatResponse;
  ppl: PlayerMatchStatResponse;
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
  const [playerStats, setPlayerStats] = useState<PlayerStatsResponse>({
    outdoor: {
      battingStats: {},
      bowlingStats: {},
      matchesCount: 0,
    },
    ppl: {
      battingStats: {},
      bowlingStats: {},
      matchesCount: 0,
    },
  });
  useEffect(() => {
    const getPlayerStats = async () => {
      const response: any = await api.get(`/players/${playerDetails.id}/stats`);
      if (response.ok) {
        const data: PlayerStatsResponse = response.data;
        setPlayerStats({
          ...data,
        });
      }
    };
    getPlayerStats();
  }, []);

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
        <SectionTitle title="Player Stats (Outdoor)" />
        {playerStats.outdoor.battingStats?.bestScore &&
          playerStats.outdoor.battingStats.bestScore !== null && (
            <PlayerStat
              header="Highest Batting Score"
              body={`Vs ${playerStats.outdoor.battingStats.bestScore.match.oppositeTeam.name}`}
              value={`${playerStats.outdoor.battingStats.bestScore.score}${
                playerStats.outdoor.battingStats.bestScore.isOut ? '' : '*'
              }/${playerStats.outdoor.battingStats.bestScore.balls}`}
            />
          )}
        {playerStats.outdoor.bowlingStats?.bestScore &&
          playerStats.outdoor.bowlingStats.bestScore !== null && (
            <PlayerStat
              header="Highest Wickets count"
              body={`On ${playerStats.outdoor.bowlingStats.bestScore.match.oppositeTeam.name}`}
              value={`${playerStats.outdoor.bowlingStats.bestScore.wickets}/${playerStats.outdoor.bowlingStats.bestScore.conceded}`}
            />
          )}
        {playerStats.outdoor.battingStats?.averageStrikeRate &&
          playerStats.outdoor.battingStats.averageStrikeRate !== null && (
            <PlayerStat
              header="Strike Rate"
              body="Average"
              value={playerStats.outdoor.battingStats.averageStrikeRate.toFixed(
                2
              )}
            />
          )}
        {playerStats.outdoor.bowlingStats?.averageEconomy &&
          playerStats.outdoor.bowlingStats.averageEconomy !== null && (
            <PlayerStat
              header="Economy"
              body="Average"
              value={playerStats.outdoor.bowlingStats.averageEconomy.toFixed(2)}
            />
          )}
        {playerStats.outdoor.battingStats?.totalBalls &&
          playerStats.outdoor.battingStats.totalBalls !== null && (
            <PlayerStat
              header="Batting Average"
              body="Average"
              value={
                (
                  (playerStats.outdoor.battingStats.totalScore || 0) /
                  (playerStats.outdoor.battingStats.dismissedCount || 1)
                ).toFixed(2) +
                (playerStats.outdoor.battingStats.dismissedCount ? '' : '*')
              }
            />
          )}
        {playerStats.outdoor.bowlingStats?.totalWickets &&
          playerStats.outdoor.bowlingStats.totalWickets !== null && (
            <PlayerStat
              header="Bowling Average"
              body="Average"
              value={(
                playerStats.outdoor.bowlingStats.totalConceded /
                playerStats.outdoor.bowlingStats.totalWickets
              ).toFixed(2)}
            />
          )}
        {playerStats.outdoor.battingStats?.totalBalls &&
          playerStats.outdoor.battingStats.totalBalls !== null && (
            <PlayerStat
              header="Total Runs"
              body="count"
              value={`${playerStats.outdoor.battingStats.totalScore || 0}/${
                playerStats.outdoor.battingStats.totalBalls
              }`}
            />
          )}
        {playerStats.outdoor.bowlingStats?.totalWickets !== undefined &&
          playerStats.outdoor.bowlingStats?.totalWickets !== null && (
            <PlayerStat
              header="Total Wickets"
              body="count"
              value={`${playerStats.outdoor.bowlingStats.totalWickets || 0}/${
                playerStats.outdoor.bowlingStats.totalConceded
              }`}
            />
          )}
        <PlayerStat
          header="Matches"
          body="count"
          value={playerStats.outdoor.matchesCount}
        />

        <SectionTitle title="Player Stats (PPL)" />
        {playerStats.ppl.battingStats?.bestScore &&
          playerStats.ppl.battingStats.bestScore !== null && (
            <PlayerStat
              header="Highest Batting Score"
              body={`On ${playerStats.ppl.battingStats.bestScore.match.date}`}
              value={`${playerStats.ppl.battingStats.bestScore.score}${
                playerStats.ppl.battingStats.bestScore.isOut ? '' : '*'
              }/${playerStats.ppl.battingStats.bestScore.balls}`}
            />
          )}
        {playerStats.ppl.bowlingStats?.bestScore &&
          playerStats.ppl.bowlingStats.bestScore !== null && (
            <PlayerStat
              header="Highest Wickets count"
              body={`On ${playerStats.ppl.bowlingStats.bestScore.match.date}`}
              value={`${playerStats.ppl.bowlingStats.bestScore.wickets}/${playerStats.ppl.bowlingStats.bestScore.conceded}`}
            />
          )}
        {playerStats.ppl.battingStats?.averageStrikeRate &&
          playerStats.ppl.battingStats.averageStrikeRate !== null && (
            <PlayerStat
              header="Strike Rate"
              body="Average"
              value={playerStats.ppl.battingStats.averageStrikeRate.toFixed(2)}
            />
          )}
        {playerStats.ppl.bowlingStats?.averageEconomy &&
          playerStats.ppl.bowlingStats.averageEconomy !== null && (
            <PlayerStat
              header="Economy"
              body="Average"
              value={playerStats.ppl.bowlingStats.averageEconomy.toFixed(2)}
            />
          )}
        {playerStats.ppl.battingStats?.totalBalls &&
          playerStats.ppl.battingStats.totalBalls !== null && (
            <PlayerStat
              header="Batting Average"
              body="Average"
              value={
                (
                  (playerStats.ppl.battingStats.totalScore || 0) /
                  (playerStats.ppl.battingStats.dismissedCount || 1)
                ).toFixed(2) +
                (playerStats.ppl.battingStats.dismissedCount ? '' : '*')
              }
            />
          )}
        {playerStats.ppl.bowlingStats?.totalWickets &&
          playerStats.ppl.bowlingStats.totalWickets !== null && (
            <PlayerStat
              header="Bowling Average"
              body="Average"
              value={(
                playerStats.ppl.bowlingStats.totalConceded /
                playerStats.ppl.bowlingStats.totalWickets
              ).toFixed(2)}
            />
          )}
        {playerStats.ppl.battingStats?.totalBalls &&
          playerStats.ppl.battingStats.totalBalls !== null && (
            <PlayerStat
              header="Total Runs"
              body="count"
              value={`${playerStats.ppl.battingStats.totalScore || 0}/${
                playerStats.ppl.battingStats.totalBalls
              }`}
            />
          )}
        {playerStats.ppl.bowlingStats?.totalWickets !== undefined &&
          playerStats.ppl.bowlingStats?.totalWickets !== null && (
            <PlayerStat
              header="Total Wickets"
              body="count"
              value={`${playerStats.ppl.bowlingStats.totalWickets || 0}/${
                playerStats.ppl.bowlingStats.totalConceded
              }`}
            />
          )}
        <PlayerStat
          header="Matches"
          body="count"
          value={playerStats.ppl.matchesCount}
        />
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
