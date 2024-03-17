import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Button from '../components/base/Button';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import SearchField from '../components/base/SearchField';
import PlayerItem from '../components/PlayerItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import ConfirmBox from '../components/base/ConfirmBox';

const Players = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const samplePlayersList: {
    id: number;
    name: string;
    mainRoll: 'batsman' | 'bowler' | 'allRounder';
    isWicketKeeper: boolean;
    isCaptain: boolean;
  }[] = [
    {
      id: 1,
      name: 'Adonis Ross',
      mainRoll: 'batsman',
      isWicketKeeper: true,
      isCaptain: true,
    },
    {
      id: 2,
      name: 'Robert Robinson',
      mainRoll: 'bowler',
      isWicketKeeper: true,
      isCaptain: false,
    },
    {
      id: 3,
      name: 'Adonis Ross',
      mainRoll: 'allRounder',
      isWicketKeeper: false,
      isCaptain: true,
    },
    {
      id: 4,
      name: 'Adonis Ross',
      mainRoll: 'batsman',
      isWicketKeeper: false,
      isCaptain: false,
    },
    {
      id: 5,
      name: 'Adonis Ross',
      mainRoll: 'batsman',
      isWicketKeeper: true,
      isCaptain: true,
    },
    {
      id: 6,
      name: 'Adonis Ross',
      mainRoll: 'batsman',
      isWicketKeeper: true,
      isCaptain: true,
    },
    {
      id: 7,
      name: 'Adonis Ross',
      mainRoll: 'batsman',
      isWicketKeeper: true,
      isCaptain: true,
    },
    {
      id: 8,
      name: 'Adonis Ross',
      mainRoll: 'batsman',
      isWicketKeeper: true,
      isCaptain: true,
    },
    {
      id: 9,
      name: 'Adonis Ross',
      mainRoll: 'batsman',
      isWicketKeeper: true,
      isCaptain: true,
    },
    {
      id: 10,
      name: 'Adonis Ross',
      mainRoll: 'batsman',
      isWicketKeeper: true,
      isCaptain: true,
    },
  ];

  return (
    <View style={styles.container}>
      <SearchField
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <FlatList
        data={samplePlayersList}
        renderItem={({ item }) => (
          <PlayerItem
            key={item.id}
            {...item}
            onPress={(id) =>
              navigation.navigate(NavigationRoutes.OVERVIEW_PLAYER, item)
            }
            onRequestEdit={() =>
              navigation.navigate(NavigationRoutes.CREATE_PLAYER)
            }
            onRequestDelete={() => setDeleteConfirmationVisible(true)}
          />
        )}
      />
      <ConfirmBox
        visible={deleteConfirmationVisible}
        title="Are you sure you want to delete this player?"
        ok={{ text: 'Delete', onPress: () => console.log() }}
        cancel={{
          text: 'Cancel',
          onPress: () => setDeleteConfirmationVisible(false),
        }}
      />
      <Button
        sticky={true}
        position={{ bottom: 10, right: 10 }}
        shape="square"
        size={52}
        color={Colors.DEEP_TEAL}
        style="filled"
        icon={() => (
          <AntDesign name="adduser" size={24} color={Colors.OFF_WHITE} />
        )}
        onPress={() => navigation.navigate(NavigationRoutes.CREATE_PLAYER)}
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

export default Players;
