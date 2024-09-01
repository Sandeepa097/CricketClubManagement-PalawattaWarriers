import React from 'react';
import { Dimensions, StyleSheet, Pressable, View, Text } from 'react-native';
import { Colors } from '../constants/Colors';

const width: number = Dimensions.get('window').width;

const PaymentPlan = ({
  player,
  fee,
  effective,
}: {
  player: {
    id: number | string;
    name: string;
  };
  fee: number;
  effective: string;
}) => {
  return (
    <Pressable style={styles.shadowContainer}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{player.name}</Text>
            <View style={styles.textsContainer}>
              <Text style={styles.text}>Monthly Fee</Text>
              <Text style={styles.text}>Rs. {fee}</Text>
            </View>
            <View style={[styles.textsContainer, { marginTop: 10 }]}>
              <Text style={styles.text}>Effective From</Text>
              <Text style={styles.text}>{effective}</Text>
            </View>
          </View>
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
    marginTop: 10,
    backgroundColor: Colors.LIGHT_SHADOW,
    borderRadius: 15,
  },
  container: {
    width: width - 20,
    backgroundColor: Colors.OFF_WHITE,
    borderRadius: 15,
    padding: 15,
  },
  name: {
    fontSize: 18,
    color: Colors.DEEP_TEAL,
    fontFamily: 'Anybody-Regular',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  contentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textsContainer: {
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
