import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import SectionTitle from '../components/base/SectionTitle';
import PaymentPlan from '../components/PaymentPlan';
import PaymentItem from '../components/PaymentItem';
import MonthlyPaymentSummery from '../components/MonthlyPaymentSummary';
import ConfirmBox from '../components/base/ConfirmBox';
import SwipeAction from '../components/SwipeAction';

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
  const [deletePlanConfirmationVisible, setDeletePlanConfirmationVisible] =
    useState(false);
  const [
    deletePaymentConfirmationVisible,
    setDeletePaymentConfirmationVisible,
  ] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <SectionTitle title="Ongoing Plan" marginTop={10} />
        <SwipeAction
          onRequestEdit={() =>
            navigation.navigate(NavigationRoutes.CREATE_PAYMENT_PLAN, {
              type: 'ongoing',
            })
          }>
          <PaymentPlan fee={50} effective="January 2024" />
        </SwipeAction>

        <SectionTitle title="Future Plan" />
        <SwipeAction
          onRequestEdit={() =>
            navigation.navigate(NavigationRoutes.CREATE_PAYMENT_PLAN, {
              type: 'future',
            })
          }
          onRequestDelete={() => setDeletePlanConfirmationVisible(true)}>
          <PaymentPlan fee={100} effective="November 2024" />
        </SwipeAction>

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
          <PaymentItem
            key={item.id}
            {...item}
            pending={false}
            onRequestDelete={() => setDeletePaymentConfirmationVisible(true)}
            onRequestEdit={() =>
              navigation.navigate(NavigationRoutes.CREATE_PAYMENTS)
            }
          />
        ))}
      </ScrollView>
      <ConfirmBox
        visible={deletePlanConfirmationVisible}
        title="Are you sure you want to delete this plan?"
        ok={{ text: 'Delete', onPress: () => console.log('delete') }}
        cancel={{
          text: 'Cancel',
          onPress: () => setDeletePlanConfirmationVisible(false),
        }}
      />
      <ConfirmBox
        visible={deletePaymentConfirmationVisible}
        title="Are you sure you want to delete this payment?"
        ok={{ text: 'Delete', onPress: () => console.log('delete') }}
        cancel={{
          text: 'Cancel',
          onPress: () => setDeletePaymentConfirmationVisible(false),
        }}
      />
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
        onPress={() => navigation.navigate(NavigationRoutes.CREATE_PAYMENTS)}
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
