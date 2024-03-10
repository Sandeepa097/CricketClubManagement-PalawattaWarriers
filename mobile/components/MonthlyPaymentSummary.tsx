import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { AntDesign } from '@expo/vector-icons';

interface SingleDataProp {
  projected: number;
  received: number;
  due: number;
}

interface OnDateChangeReturns {
  month: number;
  year: number;
}

interface MonthlyPaymentSummaryProps {
  data: SingleDataProp;
  loading: boolean;
  onDateChange: (data: OnDateChangeReturns) => void;
}

const width: number = Dimensions.get('window').width;

const MonthlyPaymentSummery = (props: MonthlyPaymentSummaryProps) => {
  const manipulator = new Date();
  const [date, setDate] = useState(new Date());

  const handleDateChange = (direction: 'next' | 'back') => {
    manipulator.setFullYear(date.getFullYear());
    manipulator.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
    setDate(manipulator);
    onDateChange(manipulator);
  };

  const onDateChange = (updatedDate: Date) => {
    props.onDateChange({
      month: updatedDate.getMonth(),
      year: updatedDate.getFullYear(),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => handleDateChange('back')}>
          <AntDesign name="caretleft" size={18} color={Colors.DEEP_TEAL} />
        </TouchableOpacity>
        <Text style={styles.date}>
          {new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)},{' '}
          {date.getFullYear()}
        </Text>
        <TouchableOpacity
          style={styles.next}
          onPress={() => handleDateChange('next')}>
          <AntDesign name="caretright" size={18} color={Colors.DEEP_TEAL} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.dataContainer}>
          <Text style={styles.data}>Projected</Text>
          <Text style={styles.data}>{props.data.projected}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.data}>Received</Text>
          <Text style={styles.data}>{props.data.received}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.data}>Due Amount</Text>
          <Text style={styles.data}>{props.data.due}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 20,
  },
  header: {
    width: '100%',
    backgroundColor: Colors.OFF_WHITE,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  back: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 25,
    height: 25,
  },
  next: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 25,
    height: 25,
  },
  date: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DEEP_TEAL,
  },
  body: {
    width: '100%',
    backgroundColor: Colors.MEDIUM_TEAL,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    padding: 15,
  },
  dataContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  data: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.OFF_WHITE,
  },
});

export default MonthlyPaymentSummery;
