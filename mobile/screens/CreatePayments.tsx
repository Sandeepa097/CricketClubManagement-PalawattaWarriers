import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ChildInputWithPlayers from '../components/ChildInputWithPlayers';

const CreatePayments = () => {
  const [paymentDetails, setPaymentDetails] = useState([]);

  return (
    <View style={styles.container}>
      <ChildInputWithPlayers
        placeholder="Select Payees"
        values={paymentDetails}
        onChangeValues={(values) => {
          console.log(values);
          setPaymentDetails(values);
        }}
        itemProperties={[
          { type: 'text', name: 'amount', placeholder: 'Paid Amount' },
        ]}
      />
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
