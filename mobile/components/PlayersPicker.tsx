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
  selected: string | number | (string | number)[];
  error?: string;
  disabled?: boolean;
  onBlur?: () => void;
  onChangeSelection: (values: string | number | (string | number)[]) => void;
}

const PlayersPicker = (props: PlayersPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const onPressItem = (id: string | number) => {
    if (Array.isArray(props.selected)) {
      if (props.selected.includes(id)) {
        props.onChangeSelection(
          props.selected.filter((itemId) => itemId !== id)
        );
      } else {
        props.onChangeSelection([...props.selected, id]);
      }
    } else {
      props.onChangeSelection(id);
    }
  };

  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        <ClickableInput
          containerStyle={{ marginBottom: 0 }}
          placeholder={props.placeholder}
          disabled={props.disabled}
          value={
            Array.isArray(props.selected)
              ? props.selected
                  .map((id) => {
                    const player = props.players.find(
                      (player) => player.id === id
                    );
                    return player.name;
                  })
                  .join(', ')
              : props.players.find((player) => player.id === props.selected)
                  ?.name
          }
          icon={() => (
            <Entypo name="chevron-right" size={24} color={Colors.DEEP_TEAL} />
          )}
          onPress={() => (!props.disabled ? setModalVisible(true) : {})}
        />
        {props.error && true && <Text style={styles.error}>{props.error}</Text>}
      </View>
      <PlayersSelectionModal
        isVisible={modalVisible}
        players={props.players}
        selected={props.selected}
        emptyMessage={props.emptyMessage}
        onPressItem={(id) => onPressItem(id)}
        onRequestClose={() => {
          props.onBlur && props.onBlur();
          setModalVisible(false);
        }}
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
