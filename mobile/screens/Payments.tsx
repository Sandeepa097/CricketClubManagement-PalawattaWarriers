import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import Button from '../components/Button';
import { Colors } from '../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import SectionTitle from '../components/SectionTitle';
import PaymentPlan from '../components/PaymentPlan';
import PaymentItem from '../components/PaymentItem';
import MonthlyPaymentSummery from '../components/MonthlyPaymentSummary';

const samplePayments = [
  { id: 1, name: 'Adonis Ross', payment: 50, pending: true },
  { id: 2, name: 'Robert Robinson', payment: 150, pending: true },
  { id: 3, name: 'Robert Robinson', payment: 1530, pending: true },
  { id: 4, name: 'Robert Robinson', payment: 1510, pending: true },
  { id: 5, name: 'Robert Robinson', payment: 1350, pending: true },
  { id: 6, name: 'Robert Robinson', payment: 1550, pending: true },
  { id: 7, name: 'Robert Robinson', payment: 1570, pending: true },
  { id: 8, name: 'Robert Robinson', payment: 1950, pending: true },
  { id: 9, name: 'Robert Robinson', payment: 1560, pending: true },
  { id: 10, name: 'Robert Robinson', payment: 1500, pending: true },
];

const sampleCollectionData = {
  projected: 1150,
  received: 1100,
  due: 50,
};

const Payments = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <SectionTitle title="Ongoing Plan" marginTop={10} />
        <PaymentPlan fee={50} effective="January 2024" />

        <SectionTitle title="Future Plan" />
        <PaymentPlan fee={100} effective="November 2024" />

        <SectionTitle title="Collection Details" />
        <MonthlyPaymentSummery
          loading={false}
          data={sampleCollectionData}
          onDateChange={({ month, year }) => console.log(month, ', ', year)}
        />

        <SectionTitle title="Pending Payments" />
        {samplePayments.map((item) => (
          <PaymentItem key={item.id} {...item} />
        ))}

        <SectionTitle title="Previous Payments" />
        {samplePayments.map((item) => (
          <PaymentItem key={item.id} {...item} pending={false} />
        ))}
      </ScrollView>
      <Button
        sticky={true}
        position={{ bottom: 10, right: 10 }}
        shape="square"
        size={52}
        color={Colors.DEEP_TEAL}
        style="filled"
        icon={() => (
          <FontAwesome5
            name="money-check-alt"
            size={24}
            color={Colors.OFF_WHITE}
          />
        )}
        onPress={() => console.log('pressed')}
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

export default Payments;
