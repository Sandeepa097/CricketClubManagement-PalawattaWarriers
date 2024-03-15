import React, { useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import ClickableInput from './base/ClickableInput';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import Modal from 'react-native-modal';

type ValueType = 'won' | 'lost' | 'draw';

interface ResultsPickerProps {
  title: string;
  placeholder: string;
  value: ValueType | null;
  onChangeValue: (value: ValueType) => void;
}

interface BasicResultItemProps {
  text: string;
  value: ValueType;
  icon: React.FC;
}

interface ResultItemProps extends BasicResultItemProps {
  selected: boolean;
  onPress: () => void;
}

const results: BasicResultItemProps[] = [
  { text: 'Won', value: 'won', icon: () => <></> },
  { text: 'Lost', value: 'lost', icon: () => <></> },
  { text: 'Draw', value: 'draw', icon: () => <></> },
];

const width: number = Dimensions.get('window').width;

const BasicResultItem = (props: BasicResultItemProps) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.text}>{props.text}</Text>
      <props.icon />
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
      <ClickableInput
        placeholder="Result"
        value={results.find((result) => result.value === props.value)?.text}
        icon={() => (
          <Entypo name="chevron-right" size={24} color={Colors.DEEP_TEAL} />
        )}
        onPress={() => setModalVisible(true)}
      />
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.container}>
          <Text>{props.title}</Text>
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <ResultItem
                key={item.value}
                selected={props.value === item.value}
                onPress={() => props.onChangeValue(item.value)}
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
    marginRight: 4,
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
    backgroundColor: Colors.OFF_WHITE,
  },
  text: {
    color: Colors.DEEP_TEAL,
    fontSize: 20,
    fontFamily: 'Anybody-Regular',
  },
});

export default ResultsPicker;
