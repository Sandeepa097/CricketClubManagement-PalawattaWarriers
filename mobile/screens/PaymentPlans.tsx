import { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deletePlan, getPaymentPlans } from '../redux/slices/paymentSlice';
import { AppDispatch, RootState } from '../redux/store';
import { UserTypes } from '../constants/UserTypes';
import SwipeAction from '../components/SwipeAction';
import { setEditing } from '../redux/slices/statusSlice';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import EmptyListMessage from '../components/base/EmptyListMessage';
import PaymentPlan from '../components/PaymentPlan';
import SearchField from '../components/base/SearchField';
import Draggable from '../components/base/Draggable';
import Button from '../components/base/Button';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import ConfirmBox from '../components/base/ConfirmBox';

const renderPaymentPlan = (paymentPlan: any) => (
  <PaymentPlan
    player={paymentPlan.player}
    fee={paymentPlan.fee as number}
    effective={`${new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(
      new Date(
        paymentPlan.effectiveFrom.year,
        paymentPlan.effectiveFrom.month,
        1
      )
    )}, ${paymentPlan.effectiveFrom.year}`}
  />
);

const PaymentPlans = ({ route, navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [deletePlanConfirmationVisible, setDeletePlanConfirmationVisible] =
    useState(false);
  const [deleteRequestedPlanId, setDeleteRequestedPlanId] = useState(null);
  const userType = useSelector((state: RootState) => state.auth.userType);
  const paymentPlans = useSelector(
    (state: RootState) => state.payment.paymentPlans
  );
  const players = useSelector((state: RootState) => state.player.players);
  const futurePlans = useSelector(
    (state: RootState) => state.payment.paymentPlans.future
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getPaymentPlans(route.params.type));
  }, []);

  return (
    <View style={styles.container}>
      <SearchField
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <EmptyListMessage
        visible={paymentPlans[route.params.type].length === 0}
        message="No plans found."
      />
      <FlatList
        data={paymentPlans[route.params.type].filter((plan) =>
          players
            .filter(
              (player) =>
                player.name
                  .toLowerCase()
                  .indexOf(searchText.toLocaleLowerCase()) > -1
            )
            .find((player) => player.id === plan.playerId)
        )}
        renderItem={({ item }) =>
          userType === UserTypes.ADMIN || userType === UserTypes.TREASURER ? (
            <SwipeAction
              {...{
                onRequestEdit: () => {
                  dispatch(setEditing(true));
                  navigation.navigate(NavigationRoutes.CREATE_PAYMENT_PLAN, {
                    type: route.params.type,
                    ...item,
                  });
                },
                ...(route.params.type === 'future'
                  ? {
                      onRequestDelete: () => {
                        setDeleteRequestedPlanId(item.id);
                        setDeletePlanConfirmationVisible(true);
                      },
                    }
                  : {}),
              }}>
              {renderPaymentPlan({
                ...item,
                player: players.find((player) => player.id === item.playerId),
              })}
            </SwipeAction>
          ) : (
            renderPaymentPlan({
              ...item,
              player: players.find((player) => player.id === item.playerId),
            })
          )
        }
      />

      <ConfirmBox
        visible={deletePlanConfirmationVisible}
        title="Are you sure you want to delete this plan?"
        ok={{
          text: 'Delete',
          onPress: () => {
            setDeletePlanConfirmationVisible(false);
            dispatch(deletePlan(deleteRequestedPlanId))
              .unwrap()
              .then(() => {
                ToastAndroid.showWithGravity(
                  'Plan deleted successfully.',
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
            setDeleteRequestedPlanId(null);
          },
        }}
        cancel={{
          text: 'Cancel',
          onPress: () => {
            setDeleteRequestedPlanId(null);
            setDeletePlanConfirmationVisible(false);
          },
        }}
      />

      {route.params.type === 'future' &&
        (userType === UserTypes.ADMIN || userType === UserTypes.TREASURER) &&
        players.filter(
          (player) => !futurePlans.find((plan) => plan.playerId === player.id)
        ).length && (
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
                navigation.navigate(NavigationRoutes.CREATE_PAYMENT_PLAN, {
                  type: 'future',
                })
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

export default PaymentPlans;
