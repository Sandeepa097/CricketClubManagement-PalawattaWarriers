import React, { useState } from 'react';
import { View } from 'react-native';
import ClickableInput from './base/ClickableInput';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface DatePickerProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const DatePicker = (props: DatePickerProps) => {
  const onSelectDate = (event: DateTimePickerEvent, date: Date) => {
    if (event.type === 'set') props.onChange(date.toDateString());
  };

  const openDatePicker = () => {
    DateTimePickerAndroid.open({
      value: props.value ? new Date(props.value) : new Date(),
      mode: 'date',
      onChange: (event, date) => onSelectDate(event, date),
    });
  };

  return (
    <View>
      <ClickableInput
        placeholder={props.placeholder}
        value={props.value}
        icon={() => (
          <Entypo
            style={{ marginRight: 5 }}
            name="calendar"
            size={20}
            color={Colors.DEEP_TEAL}
          />
        )}
        onPress={() => openDatePicker()}
      />
    </View>
  );
};

export default DatePicker;
