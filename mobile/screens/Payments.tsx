import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import api from '../api';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { UserTypes } from '../constants/UserTypes';

interface PaymentAttributes {
  id: string | number;
  name: string;
  avatar?: string;
}

interface PendingPaymentAttributes extends PaymentAttributes {
  due: number;
}

interface PreviousPaymentAttributes extends PaymentAttributes {
  amount: number;
}

interface PaymentPlanAttributes {
  effectiveFrom: {
    year: number;
    month: number;
  };
  fee: number;
}

interface PaymentPlans {
  onGoing: PaymentPlanAttributes;
  future: PaymentPlanAttributes;
}

interface CollectionAttributes {
  projected: number;
  received: number;
  due: number;
}

const Payments = ({ navigation }) => {
  const focused = useIsFocused();
  const currentDate = new Date();
  const userType = useSelector((state: RootState) => state.auth.userType);
  const [deletePlanConfirmationVisible, setDeletePlanConfirmationVisible] =
    useState(false);
  const [
    deletePaymentConfirmationVisible,
    setDeletePaymentConfirmationVisible,
  ] = useState(false);

  const [pendingPayments, setPendingPayments] = useState<
    PendingPaymentAttributes[]
  >([]);
  const [previousPayments, setPreviousPayments] = useState<
    PreviousPaymentAttributes[]
  >([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlans>({
    onGoing: null,
    future: null,
  });
  const [collectionDetails, setCollectionDetails] =
    useState<CollectionAttributes>({
      projected: 0,
      received: 0,
      due: 0,
    });

  const getPendingPayments = async () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const response: any = await api.get(
      `/payments/dues?month=${month}&year=${year}`
    );
    if (response.ok) {
      setPendingPayments(response.data?.duePlayers);
    }
  };

  const getPreviousPayments = async () => {
    const response: any = await api.get('/payments');
    if (response.ok) {
      setPreviousPayments(response.data?.payments);
    }
  };

  const getPaymentPlans = async () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const response: any = await api.get(
      `/payments/plans?month=${month}&year=${year}`
    );

    if (response.ok) {
      setPaymentPlans({
        onGoing: response.data?.onGoingPlan,
        future: response.data?.futurePlan,
      });
    }
  };

  const getCollectionDetails = async (
    collectionYear?: number,
    collectionMonth?: number
  ) => {
    const year = collectionYear || currentDate.getFullYear();
    const month = collectionMonth || currentDate.getMonth();

    const response: any = await api.get(
      `/payments/projections?month=${month}&year=${year}`
    );

    if (response.ok) {
      setCollectionDetails({
        projected: response.data?.projected,
        received: response.data?.projected - response.data?.due,
        due: response.data?.due,
      });
    }
  };

  useEffect(() => {
    getPaymentPlans();
    getPendingPayments();
    getPreviousPayments();
  }, [focused]);

  useEffect(() => {
    getCollectionDetails();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <SectionTitle title="Ongoing Plan" marginTop={10} />
        {paymentPlans.onGoing &&
          paymentPlans.onGoing !== null &&
          (userType === UserTypes.ADMIN ? (
            <SwipeAction
              onRequestEdit={() =>
                navigation.navigate(NavigationRoutes.CREATE_PAYMENT_PLAN, {
                  type: 'ongoing',
                })
              }>
              <PaymentPlan
                fee={paymentPlans.onGoing.fee}
                effective={`${new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                }).format(
                  new Date(
                    paymentPlans.onGoing.effectiveFrom.year,
                    paymentPlans.onGoing.effectiveFrom.month,
                    1
                  )
                )}, ${paymentPlans.onGoing.effectiveFrom.year}`}
              />
            </SwipeAction>
          ) : (
            <PaymentPlan
              fee={paymentPlans.onGoing.fee}
              effective={`${new Intl.DateTimeFormat('en-US', {
                month: 'long',
              }).format(
                new Date(
                  paymentPlans.onGoing.effectiveFrom.year,
                  paymentPlans.onGoing.effectiveFrom.month,
                  1
                )
              )}, ${paymentPlans.onGoing.effectiveFrom.year}`}
            />
          ))}

        <SectionTitle title="Future Plan" />
        {paymentPlans.future &&
          paymentPlans.future !== null &&
          (userType === UserTypes.ADMIN ? (
            <SwipeAction
              onRequestEdit={() =>
                navigation.navigate(NavigationRoutes.CREATE_PAYMENT_PLAN, {
                  type: 'future',
                })
              }
              onRequestDelete={() => setDeletePlanConfirmationVisible(true)}>
              <PaymentPlan
                fee={paymentPlans.future.fee}
                effective={`${new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                }).format(
                  new Date(
                    paymentPlans.future.effectiveFrom.year,
                    paymentPlans.future.effectiveFrom.month,
                    1
                  )
                )}, ${paymentPlans.future.effectiveFrom.year}`}
              />
            </SwipeAction>
          ) : (
            <PaymentPlan
              fee={paymentPlans.future.fee}
              effective={`${new Intl.DateTimeFormat('en-US', {
                month: 'long',
              }).format(
                new Date(
                  paymentPlans.future.effectiveFrom.year,
                  paymentPlans.future.effectiveFrom.month,
                  1
                )
              )}, ${paymentPlans.future.effectiveFrom.year}`}
            />
          ))}

        <SectionTitle title="Collection Details" />
        <MonthlyPaymentSummery
          loading={false}
          data={{ ...collectionDetails, due: collectionDetails.due }}
          onDateChange={({ month, year }) => getCollectionDetails(year, month)}
        />

        <SectionTitle title={`Pending Payments (${pendingPayments.length})`} />
        {pendingPayments.map((item) => (
          <PaymentItem
            key={item.id}
            {...item}
            payment={item.due}
            pending={true}
          />
        ))}

        <SectionTitle
          title={`Previous Payments (${previousPayments.length})`}
        />
        {previousPayments.map((item) => (
          <PaymentItem
            key={item.id}
            {...item}
            payment={item.amount}
            pending={false}
            {...(userType === UserTypes.ADMIN
              ? {
                  onRequestDelete: () =>
                    setDeletePaymentConfirmationVisible(true),
                  onRequestEdit: () =>
                    navigation.navigate(NavigationRoutes.CREATE_PAYMENTS),
                }
              : {})}
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
      {userType === UserTypes.ADMIN && (
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
      )}
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
