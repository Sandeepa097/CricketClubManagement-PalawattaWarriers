import React, { Children } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Logo from '../assets/Logo';
import { Colors } from '../constants/Colors';
import StrokedText from './StrokedText';

interface PaymentProps {
  id: string | number;
  name: string;
  avatar?: string;
  payment: number;
  pending?: boolean;
}

const width: number = Dimensions.get('window').width;

const ClickablePaymentItem = ({ children }) => {
  return <Pressable style={styles.shadowContainer}>{children}</Pressable>;
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
          <Logo height={30} fill={Colors.DEEP_TEAL} />
        </View>
        <Text style={props.pending ? styles.pendingName : styles.previousName}>
          {props.name}
        </Text>
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
    <ClickablePaymentItem>
      <ChildPaymentItem {...props} />
    </ClickablePaymentItem>
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
    fontSize: 15,
    color: Colors.OFF_WHITE,
  },
  previousName: {
    fontFamily: 'Anybody-Regular',
    fontSize: 15,
    color: Colors.DARK_TEAL,
  },
  previousPayment: {
    fontFamily: 'Anybody-Regular',
    fontSize: 18,
    color: Colors.DARK_TEAL,
  },
});

export default PaymentItem;
