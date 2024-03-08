import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Button from '../components/Button';
import { Colors } from '../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import SearchField from '../components/SearchField';
import TabBar from '../components/TabBar';
import CompactMatchItem from '../components/CompactMatchItem';

const Matches = () => {
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
          <CompactMatchItem key={item.id} {...item} onPress={(id) => id} />
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
        onPress={() => console.log('pressed')}
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
