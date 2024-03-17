import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import SectionTitle from '../components/base/SectionTitle';
import TabBar from '../components/base/TabBar';
import OppositeMatchItem from '../components/OppositeMatchItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';

const OppositeTeamMatches = ({ route, navigation }) => {
  const matchesDetails = route.params;

  const [selectedTabItem, setSelectedTabItem] = useState('all');

  const getTabName = (id: 'all' | 'won' | 'lost' | 'draw', name: string) => {
    const count = matchesDetails.counts[id] || 0;
    return `${name} (${count})`;
  };

  return (
    <View style={styles.container}>
      <SectionTitle title={matchesDetails.title} marginTop={10} />
      <TabBar
        selected={selectedTabItem}
        items={[
          { id: 'all', name: getTabName('all', 'All') },
          { id: 'won', name: getTabName('won', 'Won') },
          { id: 'lost', name: getTabName('lost', 'Lost') },
          { id: 'draw', name: getTabName('draw', 'Draw') },
        ]}
        onPressItem={(id) => setSelectedTabItem(id.toString())}
      />
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={matchesDetails.matches}
          renderItem={({ item }) => (
            <OppositeMatchItem
              key={item.id}
              {...item}
              onPress={() =>
                navigation.navigate(NavigationRoutes.SCORECARD, item)
              }
            />
          )}
        />
      </View>
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

export default OppositeTeamMatches;
