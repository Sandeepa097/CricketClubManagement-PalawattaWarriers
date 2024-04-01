import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ToastAndroid } from 'react-native';
import Button from '../components/base/Button';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import SearchField from '../components/base/SearchField';
import PlayerItem from '../components/PlayerItem';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import ConfirmBox from '../components/base/ConfirmBox';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { deletePlayer, retrievePlayers } from '../redux/slices/playerSlice';
import EmptyListMessage from '../components/base/EmptyListMessage';
import { setEditing } from '../redux/slices/statusSlice';
import { useIsFocused } from '@react-navigation/native';
import { UserTypes } from '../constants/UserTypes';

const Players = ({ navigation }) => {
  const focused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState('');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [deleteRequestedId, setDeleteRequestedId] = useState(null);
  const userType = useSelector((state: RootState) => state.auth.userType);
  const players = useSelector((state: RootState) => state.player.players);

  useEffect(() => {
    if (focused) {
      dispatch(retrievePlayers());
    }
  }, [focused]);

  return (
    <View style={styles.container}>
      <SearchField
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <EmptyListMessage
        visible={players.length === 0}
        message="No players found."
      />
      <FlatList
        data={players}
        renderItem={({ item }) => (
          <PlayerItem
            key={item.id}
            {...item}
            onPress={() =>
              navigation.navigate(NavigationRoutes.OVERVIEW_PLAYER, item)
            }
            onRequestEdit={() => {
              dispatch(setEditing(true));
              navigation.navigate(NavigationRoutes.CREATE_PLAYER, { ...item });
            }}
            onRequestDelete={() => {
              setDeleteRequestedId(item.id);
              setDeleteConfirmationVisible(true);
            }}
          />
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
                setDeleteRequestedId(null);
                setDeleteConfirmationVisible(false);
                ToastAndroid.showWithGravity(
                  'Player deleted successfully.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              })
              .catch((error) => {
                setDeleteRequestedId(null);
                setDeleteConfirmationVisible(false);
                ToastAndroid.showWithGravity(
                  error,
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
      {userType === UserTypes.ADMIN && (
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
      )}
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
