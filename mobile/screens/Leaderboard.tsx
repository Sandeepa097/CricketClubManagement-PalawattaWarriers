import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabBar from '../components/TabBar';
import Toggle from '../components/Toggle';

const Leaderboard = () => {
  const [selectedTabItem, setSelectedTabItem] = useState('overall');
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
