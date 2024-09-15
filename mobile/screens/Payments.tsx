import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import SectionTitle from '../components/base/SectionTitle';
import PaymentItem from '../components/PaymentItem';
import MonthlyPaymentSummery from '../components/MonthlyPaymentSummary';
import ConfirmBox from '../components/base/ConfirmBox';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { UserTypes } from '../constants/UserTypes';
import {
  deletePayment,
  getCollectionDetails,
  getPendingPayments,
  getPreviousPayments,
} from '../redux/slices/paymentSlice';
import { setEditing } from '../redux/slices/statusSlice';
import Draggable from '../components/base/Draggable';

const isScrollCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}) => {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
};

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
  const totalPreviousPayments = useSelector(
    (state: RootState) => state.payment.previousPaymentsTotal
  );
  const collectionDetails = useSelector(
    (state: RootState) => state.payment.collection
  );
  const players = useSelector((state: RootState) => state.player.players);

  const [deleteRequestedPaymentId, setDeleteRequestedPaymentId] =
    useState(null);
  const [
    deletePaymentConfirmationVisible,
    setDeletePaymentConfirmationVisible,
  ] = useState(false);

  useEffect(() => {
    dispatch(getPendingPayments());
    if (!previousPayments.length) {
      dispatch(getPreviousPayments(0));
    }
  }, [focused]);

  const fetchMorePreviousPayments = () => {
    if (previousPayments.length < totalPreviousPayments) {
      dispatch(getPreviousPayments(previousPayments.length));
    }
  };

  const onPressPaymentItem = (id: number | string) => {
    navigation.navigate(
      NavigationRoutes.OVERVIEW_PLAYER,
      players.find((player: any) => player.id === id)
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}
        onScroll={({ nativeEvent }) => {
          if (isScrollCloseToBottom(nativeEvent)) {
            fetchMorePreviousPayments();
          }
        }}>
        {(userType === UserTypes.ADMIN || userType === UserTypes.TREASURER) && (
          <>
            <SectionTitle title="Payment Plans" marginTop={10} />
            <Button
              length="long"
              style="outlined"
              color={Colors.DARK_TEAL}
              text="Ongoing plans"
              upperCase={false}
              onPress={() =>
                navigation.navigate(NavigationRoutes.PAYMENT_PLANS, {
                  type: 'ongoing',
                })
              }
            />
            <Button
              length="long"
              style="filled"
              color={Colors.DARK_TEAL}
              text="Future plans"
              upperCase={false}
              onPress={() =>
                navigation.navigate(NavigationRoutes.PAYMENT_PLANS, {
                  type: 'future',
                })
              }
            />
          </>
        )}

        <SectionTitle title="Collection Details" marginTop={10} />
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
            onPress={(id) => onPressPaymentItem(id)}
          />
        ))}

        <SectionTitle title={`Previous Payments (${totalPreviousPayments})`} />
        {previousPayments.map((item) => (
          <PaymentItem
            key={item.id}
            {...item.player}
            payment={item.amount}
            timestamp={new Date(item.createdAt)}
            pending={false}
            onPress={(id) => onPressPaymentItem(id)}
            {...(userType === UserTypes.ADMIN ||
            userType === UserTypes.TREASURER
              ? {
                  onRequestDelete: () => {
                    setDeleteRequestedPaymentId(item.id);
                    setDeletePaymentConfirmationVisible(true);
                  },
                  onRequestEdit: () => {
                    dispatch(setEditing(true));
                    navigation.navigate(NavigationRoutes.CREATE_PAYMENTS, item);
                  },
                }
              : {})}
          />
        ))}
      </ScrollView>
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
      {(userType === UserTypes.ADMIN || userType === UserTypes.TREASURER) && (
        <Draggable>
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
            onPress={() =>
              navigation.navigate(NavigationRoutes.CREATE_PAYMENTS)
            }
          />
        </Draggable>
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
