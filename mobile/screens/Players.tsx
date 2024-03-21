import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, ToastAndroid } from 'react-native';
import Button from '../components/base/Button';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import SearchField from '../components/base/SearchField';
import PlayerItem from '../components/PlayerItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import ConfirmBox from '../components/base/ConfirmBox';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { deletePlayer } from '../redux/slices/playerSlice';

const Players = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState('');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [deleteRequestedId, setDeleteRequestedId] = useState(null);
  const players = useSelector((state: RootState) => state.player.players);

  return (
    <View style={styles.container}>
      <SearchField
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <FlatList
        style={{ height: '100%' }}
        data={players}
        renderItem={({ item }) => (
          <PlayerItem
            key={item.id}
            {...item}
            onPress={() =>
              navigation.navigate(NavigationRoutes.OVERVIEW_PLAYER, item)
            }
            onRequestEdit={() =>
              navigation.navigate(NavigationRoutes.CREATE_PLAYER)
            }
            onRequestDelete={() => {
              setDeleteRequestedId(item.id);
              setDeleteConfirmationVisible(true);
            }}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlignVertical: 'center' }}>No players found</Text>
        )}
      />
      <ConfirmBox
        visible={deleteConfirmationVisible}
        title="Are you sure you want to delete this player?"
        ok={{
          text: 'Delete',
          onPress: () => {
            dispatch(deletePlayer(deleteRequestedId))
              .unwrap()
              .then(() => {
                ToastAndroid.showWithGravity(
                  'Player deleted successfully.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              });
          },
        }}
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
