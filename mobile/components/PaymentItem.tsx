import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Logo from '../assets/Logo';
import { Colors } from '../constants/Colors';
import StrokedText from './base/StrokedText';
import SwipeAction from './SwipeAction';

interface PaymentProps {
  id: string | number;
  name: string;
  avatar?: string;
  payment: number;
  timestamp?: Date;
  pending?: boolean;
  onRequestDelete?: () => void;
  onRequestEdit?: () => void;
}

const width: number = Dimensions.get('window').width;

const SwipeablePaymentItem = ({
  children,
  onRequestDelete,
  onRequestEdit,
}: {
  children: React.ReactNode;
  onRequestDelete: () => void;
  onRequestEdit: () => void;
}) => {
  return (
    <SwipeAction
      onRequestDelete={onRequestDelete}
      onRequestEdit={onRequestEdit}>
      <View style={styles.shadowContainer}>{children}</View>
    </SwipeAction>
  );
};

const ChildPaymentItem = (props: PaymentProps) => {
  return (
    <View
      style={
        props.pending
          ? [styles.pendingPaymentContainer, { marginBottom: 10 }]
          : styles.previousPaymentContainer
      }>
      <View style={styles.detailsContainer}>
        <View style={styles.avatarContainer}>
          {!props.avatar ? (
            <Logo height={30} fill={Colors.DEEP_TEAL} />
          ) : (
            <Image
              source={{ uri: props.avatar }}
              style={{ height: 40, width: 40, borderRadius: 20 }}
            />
          )}
        </View>
        <View>
          <Text
            style={props.pending ? styles.pendingName : styles.previousName}>
            {props.name}
          </Text>
          {props.timestamp && true && (
            <Text style={styles.timestamp}>
              {props.timestamp.toLocaleString('en-GB', { hour12: true })}
            </Text>
          )}
        </View>
      </View>
      {!props.pending && (
        <Text style={styles.previousPayment}>{props.payment}</Text>
      )}
      {props.pending && (
        <StrokedText
          text={props.payment}
          color={Colors.DEEP_ORANGE}
          strokedColor={Colors.WHITE}
          strokedSize={1}
          fontSize={20}
        />
      )}
    </View>
  );
};

const PaymentItem = (props: PaymentProps) => {
  if (props.pending) return <ChildPaymentItem {...props} />;
  return (
    <SwipeablePaymentItem
      onRequestDelete={props.onRequestDelete}
      onRequestEdit={props.onRequestEdit}>
      <ChildPaymentItem {...props} />
    </SwipeablePaymentItem>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    paddingLeft: 4,
    paddingBottom: 4,
    borderRadius: 15,
    marginRight: 4,
    marginBottom: 10,
    backgroundColor: Colors.LIGHT_SHADOW,
  },
  pendingPaymentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 20,
    borderRadius: 15,
    backgroundColor: Colors.MEDIUM_TEAL,
    height: 50,
    paddingHorizontal: 15,
  },
  previousPaymentContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 20,
    borderRadius: 15,
    backgroundColor: Colors.OFF_WHITE,
    height: 50,
    paddingHorizontal: 15,
  },
  detailsContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.OFF_WHITE,
    marginRight: 10,
  },
  pendingName: {
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
    color: Colors.OFF_WHITE,
  },
  previousName: {
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
    color: Colors.DARK_TEAL,
  },
  previousPayment: {
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
    color: Colors.DARK_TEAL,
  },
  timestamp: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.MEDIUM_TEAL,
  },
});

export default PaymentItem;
