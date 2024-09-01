import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, Text } from 'react-native';
import Modal from 'react-native-modal';
import PlayerItem from './PlayerItem';
import { Colors } from '../constants/Colors';
import { PlayerType } from '../types';

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

interface PlayersSelectionModalProps {
  isVisible: boolean;
  players: PlayerType[];
  emptyMessage?: string;
  selected: string | number | (string | number)[];
  onPressItem: (id: string | number) => void;
  onRequestClose: () => void;
}

const PlayersSelectionModal = (props: PlayersSelectionModalProps) => {
  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onRequestClose}
      style={styles.modal}>
      <View style={styles.container}>
        <View>
          <FlatList
            data={props.players}
            renderItem={({ item }) => (
              <PlayerItem
                key={item.id}
                {...item}
                flat={
                  Array.isArray(props.selected)
                    ? props.selected.includes(item.id)
                    : item.id === props.selected
                }
                width={width - 50}
                onPress={(id) => {
                  props.onPressItem(id);
                  if (!Array.isArray(props.selected)) {
                    props.onRequestClose();
                  }
                }}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyMessageContainer}>
                <Text style={styles.emptyText}>
                  {props.emptyMessage || 'No players found'}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    bottom: 0,
    width: width - 30,
    marginHorizontal: 15,
    marginBottom: 0,
  },
  container: {
    backgroundColor: Colors.WHITE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: (height * 3) / 4,
    paddingVertical: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  emptyMessageContainer: {
    display: 'flex',
    width: width - 30,
    height: (height * 3) / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.DEEP_TEAL,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
});

export default PlayersSelectionModal;
