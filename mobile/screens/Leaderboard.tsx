import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import Toggle from '../components/Toggle';
import PlayerRanking from '../components/PlayerRanking';

const Leaderboard = () => {
  const [selectedTabItem, setSelectedTabItem] = useState('overall');

  const sampleOverallBoard = [
    {
      id: 1,
      name: 'Adonis Ross',
      avatar: null,
      points: 1300,
    },
    {
      id: 2,
      name: 'Robert Robinson',
      avatar: null,
      points: 1200,
    },
    {
      id: 3,
      name: 'Wesley Evans',
      avatar: null,
      points: 1085,
    },
    {
      id: 4,
      name: 'Adonis Ross',
      avatar: null,
      points: 980,
    },
    {
      id: 5,
      name: 'Adonis Ross',
      avatar: null,
      points: 800,
    },
    {
      id: 6,
      name: 'Adonis Ross',
      avatar: null,
      points: 500,
    },
    {
      id: 7,
      name: 'Adonis Ross',
      avatar: null,
      points: 400,
    },
    {
      id: 8,
      name: 'Adonis Ross',
      avatar: null,
      points: 200,
    },
    {
      id: 9,
      name: 'Adonis Ross',
      avatar: null,
      points: 100,
    },
    {
      id: 10,
      name: 'Adonis Ross',
      avatar: null,
      points: 13,
    },
  ];
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
      <PlayerRanking items={sampleOverallBoard} />
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
