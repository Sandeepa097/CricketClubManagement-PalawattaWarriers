import React from 'react';
import { Dimensions, StyleSheet, Pressable, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';

const width: number = Dimensions.get('window').width;

const PaymentPlan = ({
  fee,
  effective,
}: {
  fee: number;
  effective: string;
}) => {
  return (
    <Pressable style={styles.shadowContainer}>
      <View style={styles.container}>
        <View style={styles.textsContainer}>
          <Text style={styles.text}>Monthly Fee</Text>
          <Text style={styles.text}>Rs. {fee}</Text>
        </View>
        <View style={[styles.textsContainer, { marginTop: 10 }]}>
          <Text style={styles.text}>Effective From</Text>
          <Text style={styles.text}>{effective}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    paddingLeft: 4,
    paddingBottom: 4,
    marginRight: 4,
    backgroundColor: Colors.LIGHT_SHADOW,
    borderRadius: 15,
  },
  container: {
    width: width - 20,
    backgroundColor: Colors.OFF_WHITE,
    borderRadius: 15,
    padding: 15,
  },
  textsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DARK_TEAL,
  },
});

export default PaymentPlan;
