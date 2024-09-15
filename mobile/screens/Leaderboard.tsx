import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TabBar from '../components/base/TabBar';
import Toggle from '../components/base/Toggle';
import PlayerRanking from '../components/PlayerRanking';
import { useIsFocused } from '@react-navigation/native';
import api from '../api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NavigationRoutes } from '../constants/NavigationRoutes';

const Leaderboard = ({ navigation }) => {
  const focused = useIsFocused();
  const players = useSelector((state: RootState) => state.player.players);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('outdoor');
  const [selectedTabItem, setSelectedTabItem] = useState('overall');
  const [leaderboard, setLeaderboard] = useState({
    overall: [],
    batting: [],
    bowling: [],
    fielding: [],
  });

  const onPressRankingItem = (id: number | string) => {
    navigation.navigate(
      NavigationRoutes.OVERVIEW_PLAYER,
      players.find((player: any) => player.id === id)
    );
  };

  useEffect(() => {
    const getLeaderboard = async () => {
      const response: any = await api.get(`/rankings`, {
        type: selectedLeaderboard,
      });
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
  }, [focused, selectedLeaderboard]);

  return (
    <View style={styles.container}>
      <Toggle
        left={{ id: 'outdoor', name: 'Outdoor' }}
        right={{ id: 'ppl', name: 'PPL' }}
        onPress={(id) => setSelectedLeaderboard(id as string)}
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
      <PlayerRanking
        items={leaderboard[selectedTabItem]}
        onPressItem={(id) => onPressRankingItem(id)}
      />
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
