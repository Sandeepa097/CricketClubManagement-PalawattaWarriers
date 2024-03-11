import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ClickableInput from './base/ClickableInput';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import Modal from 'react-native-modal';

interface DateType {
  month: number;
  year: number;
}

interface MonthYearPickerProps {
  placeholder: string;
  title: string;
  value: DateType | null;
  onSelect: (selectedDate: DateType) => void;
}

const MonthYearPicker = (props: MonthYearPickerProps) => {
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (props.value) {
      const currentDate = new Date();
      currentDate.setFullYear(props.value.year);
      currentDate.setMonth(props.value.month);
      setDate(currentDate);
    }
  }, [props]);

  const onChangeDate = (direction: 'next' | 'back', type: 'month' | 'year') => {
    const manipulator = date;

    if (type === 'month')
      manipulator.setMonth(
        manipulator.getMonth() + (direction === 'next' ? 1 : -1)
      );
    else
      manipulator.setFullYear(
        manipulator.getFullYear() + (direction === 'next' ? 1 : -1)
      );

    props.onSelect({
      month: manipulator.getMonth(),
      year: manipulator.getFullYear(),
    });
  };

  const onCancel = () => {
    setModalVisible(false);
    props.onSelect({
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  };

  return (
    <View>
      <ClickableInput
        placeholder={props.placeholder}
        value={
          props.value
            ? `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
                date
              )}, ${date.getFullYear()}`
            : ''
        }
        icon={() => (
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={24}
            color={Colors.DEEP_TEAL}
          />
        )}
        onPress={() => setModalVisible(true)}
      />
      <Modal isVisible={modalVisible} onBackdropPress={() => onCancel()}>
        <View style={styles.container}>
          <Text style={styles.title}>{props.title}</Text>
          <View style={styles.selectionContainer}>
            <View style={[styles.selection, { marginRight: 5 }]}>
              <TouchableOpacity onPress={() => onChangeDate('back', 'month')}>
                <AntDesign
                  name="caretleft"
                  size={18}
                  color={Colors.DEEP_TEAL}
                />
              </TouchableOpacity>
              <Text style={styles.text}>
                {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
                  date
                )}
              </Text>
              <TouchableOpacity onPress={() => onChangeDate('next', 'month')}>
                <AntDesign
                  name="caretright"
                  size={18}
                  color={Colors.DEEP_TEAL}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.selection, { marginLeft: 5 }]}>
              <TouchableOpacity onPress={() => onChangeDate('back', 'year')}>
                <AntDesign
                  name="caretleft"
                  size={18}
                  color={Colors.DEEP_TEAL}
                />
              </TouchableOpacity>
              <Text style={styles.text}>{date.getFullYear()}</Text>
              <TouchableOpacity onPress={() => onChangeDate('next', 'year')}>
                <AntDesign
                  name="caretright"
                  size={18}
                  color={Colors.DEEP_TEAL}
                />
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  title: {
    width: '100%',
    color: Colors.DEEP_TEAL,
    fontSize: 24,
    fontFamily: 'Anybody-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectionContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  selection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: Colors.DEEP_TEAL,
    backgroundColor: Colors.OFF_WHITE,
  },
  text: {
    color: Colors.DEEP_TEAL,
    fontSize: 15,
    fontFamily: 'Anybody-Regular',
    textAlign: 'center',
  },
});

export default MonthYearPicker;
