import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ClickableInput from './base/ClickableInput';
import { AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import Modal from 'react-native-modal';
import { FormikErrors } from 'formik';

interface DateType {
  month: number;
  year: number;
}

interface MonthYearPickerProps {
  placeholder: string;
  title: string;
  value: DateType | null;
  max?: DateType;
  min?: DateType;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  onSelect: (selectedDate: DateType) => void;
}

const MonthYearPicker = (props: MonthYearPickerProps) => {
  const [date, setDate] = useState(new Date());
  const [disablePrevYear, setDisablePrevYear] = useState(false);
  const [disableNextYear, setDisableNextYear] = useState(false);
  const [disablePrevMonth, setDisablePrevMonth] = useState(false);
  const [disableNextMonth, setDisableNextMonth] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    if (!props.value && props.min) {
      currentDate.setFullYear(props.min.year);
      currentDate.setMonth(props.min.month);
    } else if (!props.value && props.max) {
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      if (
        currentYear > props.max.year ||
        (currentYear === props.max.year && currentMonth < props.max.month)
      ) {
        currentDate.setFullYear(props.max.year);
        currentDate.setMonth(props.max.month);
      }
    } else if (props.value) {
      currentDate.setFullYear(props.value.year);
      currentDate.setMonth(props.value.month);
    }

    checkForDisable(currentDate, props.min, 'min');
    checkForDisable(currentDate, props.max, 'max');
    setDate(currentDate);
  }, [props]);

  const checkForDisable = (
    consider: Date,
    compare: DateType | undefined | null,
    type: 'min' | 'max'
  ) => {
    if (!compare) {
      if (type === 'min') {
        setDisablePrevMonth(false);
        setDisablePrevYear(false);
      } else {
        setDisableNextMonth(false);
        setDisableNextYear(false);
      }
      return;
    }

    const month = consider.getMonth();
    const year = consider.getFullYear();
    if (type === 'min') {
      if (
        year <= compare.year ||
        (month < compare.month && compare.year + 1 === year)
      )
        setDisablePrevYear(true);
      else setDisablePrevYear(false);

      if (year <= compare.year && month <= compare.month)
        setDisablePrevMonth(true);
      else setDisablePrevMonth(false);
    } else {
      if (
        year >= compare.year ||
        (month > compare.month && compare.year - 1 === year)
      )
        setDisableNextYear(true);
      else setDisableNextYear(false);

      if (year >= compare.year && month >= compare.month)
        setDisableNextMonth(true);
      else setDisableNextMonth(false);
    }
    return;
  };

  const onChangeDate = (direction: 'next' | 'back', type: 'month' | 'year') => {
    const manipulator = date;

    if (type === 'month') {
      if (direction === 'back' && disablePrevMonth) return;
      if (direction === 'next' && disableNextMonth) return;
      manipulator.setMonth(
        manipulator.getMonth() + (direction === 'next' ? 1 : -1)
      );
    } else {
      if (direction === 'back' && disablePrevYear) return;
      if (direction === 'next' && disableNextYear) return;
      manipulator.setFullYear(
        manipulator.getFullYear() + (direction === 'next' ? 1 : -1)
      );
    }

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
        containerStyle={{ marginBottom: props.error ? 0 : 10 }}
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
      {props.error && true && (
        <Text style={styles.error}>{props.error?.toString()}</Text>
      )}
      <Modal isVisible={modalVisible} onBackdropPress={() => onCancel()}>
        <View style={styles.container}>
          <Text style={styles.title}>{props.title}</Text>
          <View style={styles.selectionContainer}>
            <View style={[styles.selection, { marginRight: 5 }]}>
              <TouchableOpacity
                activeOpacity={disablePrevMonth ? 1 : 0.5}
                onPress={() => onChangeDate('back', 'month')}>
                <AntDesign
                  name="caretleft"
                  size={18}
                  color={
                    disablePrevMonth ? Colors.LIGHT_SHADOW : Colors.DEEP_TEAL
                  }
                />
              </TouchableOpacity>
              <Text style={styles.text}>
                {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
                  date
                )}
              </Text>
              <TouchableOpacity
                activeOpacity={disableNextMonth ? 1 : 0.5}
                onPress={() => onChangeDate('next', 'month')}>
                <AntDesign
                  name="caretright"
                  size={18}
                  color={
                    disableNextMonth ? Colors.LIGHT_SHADOW : Colors.DEEP_TEAL
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.selection, { marginLeft: 5 }]}>
              <TouchableOpacity
                activeOpacity={disablePrevYear ? 1 : 0.5}
                onPress={() => onChangeDate('back', 'year')}>
                <AntDesign
                  name="caretleft"
                  size={18}
                  color={
                    disablePrevYear ? Colors.LIGHT_SHADOW : Colors.DEEP_TEAL
                  }
                />
              </TouchableOpacity>
              <Text style={styles.text}>{date.getFullYear()}</Text>
              <TouchableOpacity
                activeOpacity={disableNextYear ? 1 : 0.5}
                onPress={() => onChangeDate('next', 'year')}>
                <AntDesign
                  name="caretright"
                  size={18}
                  color={
                    disableNextYear ? Colors.LIGHT_SHADOW : Colors.DEEP_TEAL
                  }
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
  error: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_ORANGE,
  },
});

export default MonthYearPicker;
