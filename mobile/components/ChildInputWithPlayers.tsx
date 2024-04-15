import React, { useState } from 'react';
import { View } from 'react-native';
import ClickableChildrenInput from './base/ClickableChildrenInput';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PlayersSelectionModal from './PlayersSelectionModal';
import {
  ChildItemValues,
  ChildPropertySwitch,
  ChildPropertyText,
  PlayerType,
} from '../types';

interface ChildInputWithPlayersProps {
  playerChangeDisabled?: boolean;
  players: PlayerType[];
  emptyMessage?: string;
  placeholder: string;
  itemProperties: (ChildPropertyText | ChildPropertySwitch)[];
  values: ChildItemValues[];
  errors?: Array<{ values: object }>;
  onChangeValues: (values: ChildItemValues[]) => void;
}

const ChildInputWithPlayers = (props: ChildInputWithPlayersProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState(
    props.values?.map((value) => value.id) || []
  );
  const [values, setValues] = useState(props.values);

  const onPressItem = (id: string | number) => {
    if (selectedPlayerIds.includes(id)) {
      setSelectedPlayerIds(selectedPlayerIds.filter((itemId) => itemId !== id));
      onChangeValues(values.filter((value) => value.id !== id));
    } else {
      setSelectedPlayerIds([...selectedPlayerIds, id]);
    }
  };

  const onChangeValues = (values: ChildItemValues[]) => {
    setValues(values);
    props.onChangeValues(values);
  };

  return (
    <View>
      <ClickableChildrenInput
        placeholder={props.placeholder}
        value={selectedPlayerIds
          .map((id) => {
            const player = props.players.find((player) => player.id === id);
            return player?.name;
          })
          .filter((playerName) => playerName)
          .join(', ')}
        icon={() =>
          !props.playerChangeDisabled ? (
            <Entypo name="chevron-right" size={24} color={Colors.DEEP_TEAL} />
          ) : (
            <></>
          )
        }
        errors={props.errors}
        items={selectedPlayerIds
          .map((id) => {
            const player = props.players.find((player) => player.id === id);
            return { id: player?.id, text: player?.name };
          })
          .filter((player) => player?.id)}
        itemProperties={props.itemProperties}
        itemValues={props.values}
        onPress={() => !props.playerChangeDisabled && setModalVisible(true)}
        onChange={(values) => onChangeValues(values)}
      />
      <PlayersSelectionModal
        isVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        players={props.players}
        emptyMessage={props.emptyMessage}
        selected={selectedPlayerIds}
        onPressItem={onPressItem}
      />
    </View>
  );
};

export default ChildInputWithPlayers;
