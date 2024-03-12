import React from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import PlayerItem from './PlayerItem';
import { Colors } from '../constants/Colors';

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

interface PlayerType {
  id: string | number;
  name: string;
  mainRoll: 'batsman' | 'bowler' | 'allRounder';
  isWicketKeeper: boolean;
  isCaptain: boolean;
}

interface PlayersSelectionProps {
  isVisible: boolean;
  players: PlayerType[];
  selected: (string | number)[];
  onPressItem: (id: string | number) => void;
  onRequestClose: () => void;
}

const PlayersSelection = (props: PlayersSelectionProps) => {
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
                flat={props.selected.includes(item.id)}
                width={width - 50}
                onPress={(id) => props.onPressItem(id)}
              />
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
});

export default PlayersSelection;
