import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import SectionTitle from '../components/base/SectionTitle';
import TabBar from '../components/base/TabBar';
import OppositeMatchItem from '../components/OppositeMatchItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import ConfirmBox from '../components/base/ConfirmBox';
import { CompactSingleMatch } from '../types';

const OppositeTeamMatches = ({ route, navigation }) => {
  const matchesDetails = route.params;

  const [selectedTabItem, setSelectedTabItem] = useState('all');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const getTabName = (id: 'all' | 'won' | 'lost' | 'draw', name: string) => {
    const count = matchesDetails.counts[id] || 0;
    return `${name} (${count})`;
  };

  return (
    <View style={styles.container}>
      <SectionTitle title={matchesDetails.title} marginTop={10} />
      {matchesDetails.counts ? (
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
      ) : (
        <></>
      )}
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={
            selectedTabItem === 'all'
              ? matchesDetails.matches
              : matchesDetails.matches.filter(
                  (match: CompactSingleMatch) =>
                    match.result === selectedTabItem
                )
          }
          renderItem={({ item }) => (
            <OppositeMatchItem
              key={item.id}
              {...item}
              onPress={() =>
                navigation.navigate(NavigationRoutes.SCORECARD, item)
              }
              onRequestDelete={() => setDeleteConfirmationVisible(true)}
              onRequestEdit={() =>
                navigation.navigate(NavigationRoutes.CREATE_MATCH)
              }
            />
          )}
        />
      </View>
      <ConfirmBox
        visible={deleteConfirmationVisible}
        title="Are you sure you want to delete this match?"
        ok={{ text: 'Delete', onPress: () => console.log('delete') }}
        cancel={{
          text: 'Cancel',
          onPress: () => setDeleteConfirmationVisible(false),
        }}
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

export default OppositeTeamMatches;
