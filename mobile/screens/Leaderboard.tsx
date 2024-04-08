import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabBar from '../components/base/TabBar';
import Toggle from '../components/base/Toggle';
import PlayerRanking from '../components/PlayerRanking';
import { useIsFocused } from '@react-navigation/native';
import api from '../api';

const Leaderboard = () => {
  const focused = useIsFocused();
  const [selectedTabItem, setSelectedTabItem] = useState('overall');
  const [leaderboard, setLeaderboard] = useState({
    overall: [],
    batting: [],
    bowling: [],
    fielding: [],
  });

  useEffect(() => {
    const getLeaderboard = async () => {
      const response: any = await api.get('/rankings');
      if (response.ok)
        setLeaderboard({
          ...leaderboard,
          overall: response.data.overallRankings,
          batting: response.data.battingRankings,
          bowling: response.data.bowlingRankings,
          fielding: response.data.fieldingRankings,
        });
    };

    getLeaderboard();
  }, [focused]);

  return (
    <View style={styles.container}>
      <Toggle
        left={{ id: 'left', name: 'Outdoor' }}
        right={{ id: 'right', name: 'PPL' }}
        onPress={(id) => id}
      />
      <TabBar
        selected={selectedTabItem}
        items={[
          { id: 'overall', name: 'Overall' },
          { id: 'batting', name: 'Batting' },
          { id: 'bowling', name: 'Bowling' },
          { id: 'fielding', name: 'Fielding' },
        ]}
        onPressItem={(id) => setSelectedTabItem(id.toString())}
      />
      <PlayerRanking items={leaderboard[selectedTabItem]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});

export default Leaderboard;
