import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import SectionTitle from '../components/base/SectionTitle';

interface MatchStatsProps {
  vs?: string;
  on: string;
  in: string;
  result?: string;
}

interface PlayersStatsColumn {
  name: string;
  key: string;
}

interface PlayersStatsProps {
  columns: PlayersStatsColumn[];
  values: object[];
}

interface BattingStatsType {
  player: string;
  runs: string | number;
  balls: string | number;
  fours: string | number;
  sixes: string | number;
}

interface BowlingStatsType {
  player: string;
  wickets: string | number;
  conceded: string | number;
  overs: string | number;
  maidens: string | number;
}

interface FieldingStatsType {
  player: string;
  catches: string | number;
  stumps: string | number;
  directHits: string | number;
  indirectHits: string | number;
}

interface ScorecardProps extends MatchStatsProps {
  battingStats: BattingStatsType[];
  bowlingStats: BowlingStatsType[];
  fieldingStats: FieldingStatsType[];
}

const width: number = Dimensions.get('window').width;

const MatchStats = (props: MatchStatsProps) => {
  return (
    <View style={styles.matchStatContainer}>
      <View style={styles.statDetailsContainer}>
        <View>
          {props.vs !== undefined && props.vs !== null && (
            <Text style={styles.statKey}>Vs</Text>
          )}
          <Text style={styles.statKey}>On</Text>
          <Text style={[styles.statKey, { marginBottom: 0 }]}>In</Text>
        </View>
        <View>
          {props.vs !== undefined && props.vs !== null && (
            <Text style={styles.statText}>{props.vs}</Text>
          )}
          <Text style={styles.statText}>{props.on}</Text>
          <Text style={[styles.statText, { marginBottom: 0 }]}>{props.in}</Text>
        </View>
      </View>
      {props.result && true && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{props.result}</Text>
        </View>
      )}
    </View>
  );
};

const PlayersStats = (props: PlayersStatsProps) => {
  const widthOfColumn = (width - 30) / (props.columns.length + 0.5);
  return (
    <View style={styles.playersStatsContainer}>
      <View style={[styles.playerStatRow, { marginBottom: 10 }]}>
        {props.columns.map((column, index) => (
          <Text
            style={[
              styles.playerStatColumnText,
              index === 0
                ? { width: widthOfColumn * 1.5 }
                : { width: widthOfColumn, textAlign: 'center' },
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
            key={column.key}>
            {column.name}
          </Text>
        ))}
      </View>
      {props.values.map((value, valueIndex) => (
        <View
          key={valueIndex}
          style={[
            styles.playerStatRow,
            props.values.length === valueIndex + 1
              ? { marginBottom: 0 }
              : { marginBottom: 10 },
          ]}>
          {props.columns.map((column, index) => (
            <Text
              style={[
                styles.playerStatValueText,
                index === 0
                  ? { width: widthOfColumn * 1.5 }
                  : { width: widthOfColumn, textAlign: 'center' },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
              key={`${column.key}-${valueIndex}`}>
              {value[column.key]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const Scorecard = ({ route }) => {
  const matchDetails: ScorecardProps = {
    ...route.params,
    vs: route.params.oppositeTeam?.name,
    on: route.params.date,
    in: route.params.location,
    battingStats: route.params.battingStats.map((stat: any) => ({
      ...stat,
      player: stat.player.name,
    })),
    bowlingStats: route.params.bowlingStats.map((stat: any) => ({
      ...stat,
      player: stat.player.name,
    })),
    fieldingStats: route.params.fieldingStats
      .filter(
        (stat: any) =>
          stat.catches || stat.stumps || stat.directHits || stat.indirectHits
      )
      .map((stat: any) => ({
        ...stat,
        player: stat.player.name,
      })),
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 10,
        }}>
        <SectionTitle
          title={route.params.title || 'Match Details'}
          marginTop={10}
        />
        <MatchStats
          vs={matchDetails.vs}
          on={matchDetails.on}
          in={matchDetails.in}
          result={matchDetails.result}
        />
        {matchDetails.battingStats.length > 0 && (
          <View>
            <SectionTitle title="Batting Stats" />
            <PlayersStats
              columns={[
                { key: 'player', name: 'Batter' },
                { key: 'score', name: 'Runs' },
                { key: 'balls', name: 'Balls' },
                { key: 'fours', name: '4s' },
                { key: 'sixes', name: '6s' },
              ]}
              values={matchDetails.battingStats}
            />
          </View>
        )}
        {matchDetails.bowlingStats.length > 0 && (
          <View>
            <SectionTitle title="Bowling Stats" />
            <PlayersStats
              columns={[
                { key: 'player', name: 'Batter' },
                { key: 'wickets', name: 'Wickets' },
                { key: 'conceded', name: 'Given' },
                { key: 'overs', name: 'Overs' },
                { key: 'maidens', name: 'Maidens' },
              ]}
              values={matchDetails.bowlingStats}
            />
          </View>
        )}
        {matchDetails.fieldingStats.length > 0 && (
          <View>
            <SectionTitle title="Fielding Stats" />
            <PlayersStats
              columns={[
                { key: 'player', name: 'Batter' },
                { key: 'catches', name: 'Catches' },
                { key: 'stumps', name: 'Stumps' },
                { key: 'directHits', name: 'Direct Hits' },
                { key: 'indirectHits', name: 'Indirect Hits' },
              ]}
              values={matchDetails.fieldingStats}
            />
          </View>
        )}
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
  matchStatContainer: {
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
  playersStatsContainer: {
    width: width - 20,
    backgroundColor: Colors.MEDIUM_TEAL,
    borderRadius: 15,
    padding: 10,
  },
  statDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statKey: {
    color: Colors.BLACK,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
    marginRight: 10,
    marginBottom: 5,
  },
  statText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
    marginBottom: 5,
  },
  resultContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: Colors.AMBER,
  },
  resultText: {
    color: Colors.BLACK,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
  playerStatRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerStatColumnText: {
    color: Colors.BLACK,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
    paddingRight: 2,
  },
  playerStatValueText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
    paddingRight: 2,
  },
});

export default Scorecard;
