import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
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
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { UserTypes } from '../constants/UserTypes';
import {
  deletePayment,
  getCollectionDetails,
  getPaymentPlans,
  getPendingPayments,
  getPreviousPayments,
} from '../redux/slices/paymentSlice';

const Payments = ({ navigation }) => {
  const focused = useIsFocused();
  const dispatch = useDispatch<AppDispatch>();

  const userType = useSelector((state: RootState) => state.auth.userType);
  const pendingPayments = useSelector(
    (state: RootState) => state.payment.pendingPayments
  );
  const previousPayments = useSelector(
    (state: RootState) => state.payment.previousPayments
  );
  const paymentPlans = useSelector(
    (state: RootState) => state.payment.paymentPlans
  );
  const collectionDetails = useSelector(
    (state: RootState) => state.payment.collection
  );

  const [deleteRequestedPaymentId, setDeleteRequestedPaymentId] =
    useState(null);
  const [deletePlanConfirmationVisible, setDeletePlanConfirmationVisible] =
    useState(false);
  const [
    deletePaymentConfirmationVisible,
    setDeletePaymentConfirmationVisible,
  ] = useState(false);

  useEffect(() => {
    dispatch(getPaymentPlans());
    dispatch(getPendingPayments());
    dispatch(getPreviousPayments());
  }, [focused]);

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
          onDateChange={({ month, year }) =>
            dispatch(getCollectionDetails({ year, month }))
          }
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
            {...item.player}
            payment={item.amount}
            timestamp={new Date(item.createdAt)}
            pending={false}
            {...(userType === UserTypes.ADMIN
              ? {
                  onRequestDelete: () => {
                    setDeleteRequestedPaymentId(item.id);
                    setDeletePaymentConfirmationVisible(true);
                  },
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
          onPress: () => {
            setDeletePlanConfirmationVisible(false);
          },
        }}
      />
      <ConfirmBox
        visible={deletePaymentConfirmationVisible}
        title="Are you sure you want to delete this payment?"
        ok={{
          text: 'Delete',
          onPress: () => {
            setDeletePaymentConfirmationVisible(false);
            dispatch(deletePayment(deleteRequestedPaymentId))
              .unwrap()
              .then(() => {
                ToastAndroid.showWithGravity(
                  'Payment deleted successfully.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              })
              .catch((error) => {
                ToastAndroid.showWithGravity(
                  error,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              });
            setDeleteRequestedPaymentId(null);
          },
        }}
        cancel={{
          text: 'Cancel',
          onPress: () => {
            setDeleteRequestedPaymentId(null);
            setDeletePaymentConfirmationVisible(false);
          },
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
