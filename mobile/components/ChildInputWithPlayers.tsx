import React, { useState } from 'react';
import { View } from 'react-native';
import ClickableChildrenInput from './base/ClickableChildrenInput';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import PlayersSelection from './PlayersSelection';

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

interface ChildInputWithPlayersProps {
  placeholder: string;
  itemProperties: (ChildPropertyText | ChildPropertySwitch)[];
  values: ChildItemValues[];
  onChangeValues: (values: ChildItemValues[]) => void;
}

const ChildInputWithPlayers = (props: ChildInputWithPlayersProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
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
            const player = samplePlayersList.find((player) => player.id === id);
            return player.name;
          })
          .join(', ')}
        icon={() => (
          <Entypo name="chevron-right" size={24} color={Colors.DEEP_TEAL} />
        )}
        items={selectedPlayerIds.map((id) => {
          const player = samplePlayersList.find((player) => player.id === id);
          return { id: player.id, text: player.name };
        })}
        itemProperties={props.itemProperties}
        itemValues={props.values}
        onPress={() => setModalVisible(true)}
        onChange={(values) => onChangeValues(values)}
      />
      <PlayersSelection
        isVisible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        players={samplePlayersList}
        selected={selectedPlayerIds}
        onPressItem={onPressItem}
      />
    </View>
  );
};

export default ChildInputWithPlayers;
