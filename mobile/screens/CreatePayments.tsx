import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ChildInputWithPlayers from '../components/ChildInputWithPlayers';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';

const samplePlayersList: PlayerType[] = [
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

const CreatePayments = ({ navigation }) => {
  const [paymentDetails, setPaymentDetails] = useState([]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <ChildInputWithPlayers
          players={samplePlayersList}
          placeholder="Select Payers"
          values={paymentDetails}
          onChangeValues={(values) => {
            console.log(values);
            setPaymentDetails(values);
          }}
          itemProperties={[
            { type: 'text', name: 'amount', placeholder: 'Paid Amount' },
          ]}
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

export default CreatePayments;
