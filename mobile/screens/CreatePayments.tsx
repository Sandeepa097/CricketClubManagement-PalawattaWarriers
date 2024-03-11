import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InsertPaymentDetails from '../components/InsertPaymentDetails';

const CreatePayments = () => {
  return (
    <View style={styles.container}>
      <InsertPaymentDetails />
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
