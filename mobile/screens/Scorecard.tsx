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

const sampleScorecard: ScorecardProps = {
  vs: 'Little Lions',
  on: '27th January 2024',
  in: 'Australia',
  result: 'Won',
  battingStats: [
    {
      player: 'Adonis Ross',
      runs: '23*',
      balls: 25,
      fours: 2,
      sixes: 1,
    },
    {
      player: 'Robert Robinson',
      runs: 56,
      balls: 25,
      fours: 4,
      sixes: 2,
    },
  ],
  bowlingStats: [
    {
      player: 'Adonis Ross',
      wickets: 2,
      overs: 3.5,
      conceded: 24,
      maidens: 1,
    },
    {
      player: 'Robert Robinson',
      wickets: 2,
      overs: 3.5,
      conceded: 24,
      maidens: 1,
    },
  ],
  fieldingStats: [
    {
      player: 'Adonis Ross',
      catches: 2,
      stumps: 3,
      directHits: 1,
      indirectHits: 0,
    },
    {
      player: 'Robert Robinson',
      catches: 2,
      stumps: 3,
      directHits: 1,
      indirectHits: 0,
    },
  ],
};

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
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>{props.result}</Text>
      </View>
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

const Scorecard = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          alignItems: 'center',
        }}>
        <SectionTitle title="Match Details" marginTop={10} />
        <MatchStats
          vs={sampleScorecard.vs}
          on={sampleScorecard.on}
          in={sampleScorecard.in}
          result={sampleScorecard.result}
        />
        {sampleScorecard.battingStats.length > 0 && (
          <View>
            <SectionTitle title="Batting Stats" />
            <PlayersStats
              columns={[
                { key: 'player', name: 'Batter' },
                { key: 'runs', name: 'Runs' },
                { key: 'balls', name: 'Balls' },
                { key: 'fours', name: '4s' },
                { key: 'sixes', name: '6s' },
              ]}
              values={sampleScorecard.battingStats}
            />
          </View>
        )}
        {sampleScorecard.bowlingStats.length > 0 && (
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
              values={sampleScorecard.bowlingStats}
            />
          </View>
        )}
        {sampleScorecard.fieldingStats.length > 0 && (
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
              values={sampleScorecard.fieldingStats}
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
  },
  playerStatValueText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
  },
});

export default Scorecard;
