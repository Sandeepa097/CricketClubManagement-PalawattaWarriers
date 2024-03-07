import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';

const Leaderboard = () => {
  const [selectedTabItem, setSelectedTabItem] = useState('overall');
  return (
    <View style={styles.container}>
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
