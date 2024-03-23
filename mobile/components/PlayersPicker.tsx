import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ClickableInput from './base/ClickableInput';
import PlayersSelectionModal from './PlayersSelectionModal';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { PlayerType } from '../types';

interface PlayersPickerProps {
  placeholder: string;
  emptyMessage?: string;
  players: PlayerType[];
  selected: (string | number)[];
  error?: string;
  onChangeSelection: (values: (string | number)[]) => void;
}

const PlayersPicker = (props: PlayersPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const onPressItem = (id: string | number) => {
    if (props.selected.includes(id)) {
      props.onChangeSelection(props.selected.filter((itemId) => itemId !== id));
    } else {
      props.onChangeSelection([...props.selected, id]);
    }
  };

  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        <ClickableInput
          containerStyle={{ marginBottom: 0 }}
          placeholder={props.placeholder}
          value={props.selected
            .map((id) => {
              const player = props.players.find((player) => player.id === id);
              return player.name;
            })
            .join(', ')}
          icon={() => (
            <Entypo name="chevron-right" size={24} color={Colors.DEEP_TEAL} />
          )}
          onPress={() => setModalVisible(true)}
        />
        {props.error && true && <Text style={styles.error}>{props.error}</Text>}
      </View>
      <PlayersSelectionModal
        isVisible={modalVisible}
        players={props.players}
        selected={props.selected}
        emptyMessage={props.emptyMessage}
        onPressItem={(id) => onPressItem(id)}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  error: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_ORANGE,
  },
});

export default PlayersPicker;
