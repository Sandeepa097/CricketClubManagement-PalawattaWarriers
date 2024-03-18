import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import TextInput from '../components/base/TextInput';
import MonthYearPicker from '../components/MonthYearPicker';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';

const CreatePaymentPlan = ({ navigation, route }) => {
  const { type }: { type: 'future' | 'ongoing' } = route.params;
  const date = new Date();
  const [fee, setFee] = useState('');
  const [effective, setEffective] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <TextInput
          length="long"
          placeholder="Fee"
          onChangeText={(text) => setFee(text)}
          value={fee}
        />
        <MonthYearPicker
          placeholder="Effective from"
          title="Effective from"
          value={effective}
          min={
            type === 'future'
              ? { year: date.getFullYear(), month: date.getMonth() }
              : undefined
          }
          max={
            type === 'ongoing'
              ? { year: date.getFullYear(), month: date.getMonth() }
              : undefined
          }
          onSelect={(value) => setEffective(value)}
        />
        <View style={{ marginTop: 40 }}>
          <Button
            length="long"
            style="filled"
            color={Colors.DEEP_TEAL}
            text="Create"
            onPress={() => console.log('create')}
          />
          <Button
            length="long"
            style="outlined"
            color={Colors.DEEP_TEAL}
            text="Cancel"
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});

export default CreatePaymentPlan;
