import React, { useState } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import ClickableInput from './base/ClickableInput';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import Modal from 'react-native-modal';

type ValueType = 'won' | 'lost' | 'draw';

interface ResultsPickerProps {
  title: string;
  placeholder: string;
  value: ValueType | null;
  error?: string;
  onBlur?: () => void;
  onChangeValue: (value: ValueType) => void;
}

interface BasicResultType {
  text: string;
  value: ValueType;
  icon: 'smile-wink' | 'sad-cry' | 'meh';
}

interface ResultItemProps extends BasicResultType {
  selected: boolean;
  onPress: () => void;
}

const results: BasicResultType[] = [
  { text: 'Won', value: 'won', icon: 'smile-wink' },
  { text: 'Lost', value: 'lost', icon: 'sad-cry' },
  { text: 'Draw', value: 'draw', icon: 'meh' },
];

const width: number = Dimensions.get('window').width;

const BasicResultItem = (props: ResultItemProps) => {
  return (
    <View
      style={[
        styles.itemContainer,
        props.selected
          ? { backgroundColor: Colors.MEDIUM_TEAL, marginBottom: 10 }
          : { backgroundColor: Colors.OFF_WHITE },
      ]}>
      <Text
        style={[
          styles.text,
          { color: props.selected ? Colors.OFF_WHITE : Colors.DEEP_TEAL },
        ]}>
        {props.text}
      </Text>
      <FontAwesome5
        name={props.icon}
        size={24}
        color={props.selected ? Colors.OFF_WHITE : Colors.DEEP_TEAL}
      />
    </View>
  );
};

const ResultItem = (props: ResultItemProps) => {
  if (props.selected) return <BasicResultItem {...props} />;
  else
    return (
      <Pressable style={styles.shadowContainer} onPress={props.onPress}>
        <BasicResultItem {...props} />
      </Pressable>
    );
};

const ResultsPicker = (props: ResultsPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        <ClickableInput
          containerStyle={{ marginBottom: 0 }}
          placeholder="Result"
          value={results.find((result) => result.value === props.value)?.text}
          icon={() => (
            <Entypo name="chevron-right" size={24} color={Colors.DEEP_TEAL} />
          )}
          onPress={() => setModalVisible(true)}
        />
        {props.error && true && <Text style={styles.error}>{props.error}</Text>}
      </View>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => {
          props.onBlur && props.onBlur();
          setModalVisible(false);
        }}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Result</Text>
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <ResultItem
                key={item.value}
                selected={props.value === item.value}
                onPress={() => {
                  props.onChangeValue(item.value);
                  setModalVisible(false);
                }}
                {...item}
              />
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 15,
  },
  shadowContainer: {
    paddingLeft: 4,
    paddingBottom: 4,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: Colors.LIGHT_SHADOW,
  },
  itemContainer: {
    padding: 10,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    width: '100%',
    color: Colors.DEEP_TEAL,
    fontSize: 24,
    fontFamily: 'Anybody-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
  error: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_ORANGE,
  },
});

export default ResultsPicker;
