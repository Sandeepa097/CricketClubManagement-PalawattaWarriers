import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import SearchField from '../components/base/SearchField';
import TabBar from '../components/base/TabBar';
import CompactMatchItem from '../components/CompactMatchItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';

const Matches = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedTabItem, setSelectedTabItem] = useState('outdoor');

  const sampleOutdoorMatchesList = [
    {
      id: 1,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
      matches: [
        {
          id: 1,
          date: '27th January 2023',
          location: 'Australia',
          result: 'won',
        },
        {
          id: 2,
          date: '27th March 2023',
          location: 'England',
          result: 'lost',
        },
        {
          id: 3,
          date: '01th January 2024',
          location: 'France',
          result: 'draw',
        },
      ],
    },
    {
      id: 2,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
    {
      id: 3,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
    {
      id: 4,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
    {
      id: 5,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
    {
      id: 6,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
    {
      id: 7,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
    {
      id: 8,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
    {
      id: 9,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
    {
      id: 10,
      title: 'Green Lions',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      counts: {
        all: 10,
        won: 5,
        lost: 3,
        draw: 2,
      },
      winningPercentage: 25,
    },
  ];

  const samplePPLMatchesList = [
    {
      id: 1,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 2,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 3,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 4,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 5,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 6,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 7,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 8,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 9,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
    {
      id: 10,
      title: '20th January 2024',
      bestBatsman: {
        id: 1,
        name: 'Adonis Ross',
        score: '255/134',
      },
      bestBowler: {
        id: 1,
        name: 'Robert Robinson',
        score: '8/67',
      },
      winningPercentage: null,
    },
  ];

  return (
    <View style={styles.container}>
      <SearchField
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <TabBar
        selected={selectedTabItem}
        items={[
          { id: 'outdoor', name: 'Outdoor' },
          { id: 'ppl', name: 'PPL' },
        ]}
        onPressItem={(id) => setSelectedTabItem(id.toString())}
      />
      <FlatList
        data={
          selectedTabItem === 'outdoor'
            ? sampleOutdoorMatchesList
            : samplePPLMatchesList
        }
        renderItem={({ item }) => (
          <CompactMatchItem
            key={item.id}
            {...item}
            onPress={() =>
              navigation.navigate(
                selectedTabItem === 'outdoor'
                  ? NavigationRoutes.OPPOSITE_TEAM_MATCHES
                  : NavigationRoutes.SCORECARD,
                item
              )
            }
            {...(selectedTabItem === 'ppl'
              ? {
                  onRequestDelete: () => console.log('edit'),
                  onRequestEdit: () =>
                    navigation.navigate(NavigationRoutes.CREATE_MATCH),
                }
              : {})}
          />
        )}
      />
      <Button
        sticky={true}
        position={{ bottom: 10, right: 10 }}
        shape="square"
        size={52}
        color={Colors.DEEP_TEAL}
        style="filled"
        icon={() => (
          <MaterialIcons name="post-add" size={24} color={Colors.OFF_WHITE} />
        )}
        onPress={() => navigation.navigate(NavigationRoutes.CREATE_MATCH)}
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

export default Matches;
