import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ImagePicker from '../components/base/ImagePicker';
import TextInput from '../components/base/TextInput';
import RollsSelection from '../components/RollsSelection';
import MonthYearPicker from '../components/MonthYearPicker';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';

const CreatePlayer = ({ navigation }) => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [selectedRolls, setSelectedRolls] = useState(null);
  const [payingSince, setPayingSince] = useState(null);

  return (
    <View style={styles.container}>
      <ImagePicker />
      <TextInput
        length="long"
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <RollsSelection
        value={selectedRolls}
        onChangeValue={(selection) => setSelectedRolls(selection)}
      />
      <MonthYearPicker
        placeholder="Fees Paying Since"
        title="Fees Paying Since"
        value={payingSince}
        onSelect={(value) => setPayingSince(value)}
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

export default CreatePlayer;
