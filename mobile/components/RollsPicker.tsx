import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import ClickableInput from './base/ClickableInput';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import Modal from 'react-native-modal';
import { FormikErrors } from 'formik';

interface Selection {
  mainRoll: 'batsman' | 'bowler' | 'allRounder' | null;
  isCaptain: boolean;
  isWicketKeeper: boolean;
}

interface RollsPickerProps {
  value: null | Selection;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  onChangeValue: (selection: Selection) => void;
}

const getValueAsString = (value: Selection) => {
  const mainRoll = value.mainRoll
    ? value.mainRoll.charAt(0).toUpperCase() +
      value.mainRoll.replace(/([A-Z])/g, ' $1').slice(1)
    : '';
  let subRolls = '';
  if (value.isWicketKeeper)
    subRolls += `${value.mainRoll ? ', ' : ''}Wicket Keeper`;
  if (value.isCaptain)
    subRolls += `${value.mainRoll || subRolls ? ', ' : ''}Captain`;

  return mainRoll + subRolls;
};

const SelectionOption = ({
  text,
  value,
  onToggle,
}: {
  text: string;
  value: boolean;
  onToggle: () => void;
}) => {
  return (
    <View style={styles.option}>
      <Text style={styles.optionText}>{text}</Text>
      <Switch value={value} onChange={onToggle} />
    </View>
  );
};

const RollsPicker = (props: RollsPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  console.log('err', props.error);

  const setMainRoll = (value: 'batsman' | 'bowler' | 'allRounder') => {
    props.onChangeValue({
      mainRoll: props.value?.mainRoll === value ? null : value,
      isCaptain: props.value?.isCaptain || false,
      isWicketKeeper: props.value?.isWicketKeeper || false,
    });
  };

  const setSubRoll = (property: 'isCaptain' | 'isWicketKeeper') => {
    const defaultSelection = {
      mainRoll: props.value?.mainRoll || null,
      isCaptain: props.value?.isCaptain || false,
      isWicketKeeper: props.value?.isWicketKeeper || false,
    };
    props.onChangeValue({
      ...defaultSelection,
      [property]: !defaultSelection[property],
    });
  };

  return (
    <View style={{ marginBottom: 10 }}>
      <ClickableInput
        containerStyle={{ marginBottom: 0 }}
        placeholder="Rolls"
        value={props.value ? getValueAsString(props.value) : ''}
        icon={() => (
          <Entypo name="chevron-right" size={24} color={Colors.DEEP_TEAL} />
        )}
        onPress={() => setModalVisible(true)}
      />
      {props.error && true && (
        <Text style={styles.error}>{props.error.toString()}</Text>
      )}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Rolls</Text>
          <View style={styles.optionsContainer}>
            <SelectionOption
              text="Batsman"
              value={props.value?.mainRoll === 'batsman'}
              onToggle={() => setMainRoll('batsman')}
            />
            <SelectionOption
              text="Bowler"
              value={props.value?.mainRoll === 'bowler'}
              onToggle={() => setMainRoll('bowler')}
            />
            <SelectionOption
              text="All Rounder"
              value={props.value?.mainRoll === 'allRounder'}
              onToggle={() => setMainRoll('allRounder')}
            />
            <SelectionOption
              text="Wicket Keeper"
              value={props.value?.isWicketKeeper}
              onToggle={() => setSubRoll('isWicketKeeper')}
            />
            <SelectionOption
              text="Captain"
              value={props.value?.isCaptain}
              onToggle={() => setSubRoll('isCaptain')}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.OFF_WHITE,
    borderRadius: 15,
    padding: 15,
  },
  title: {
    width: '100%',
    color: Colors.DEEP_TEAL,
    fontSize: 24,
    fontFamily: 'Anybody-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  optionsContainer: {
    width: '100%',
    marginTop: 20,
  },
  option: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    color: Colors.DEEP_TEAL,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
  error: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_ORANGE,
  },
});

export default RollsPicker;
