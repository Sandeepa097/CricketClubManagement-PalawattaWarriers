import React from 'react';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import TextInput from '../components/base/TextInput';
import MonthYearPicker from '../components/MonthYearPicker';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { createPlan, updatePlan } from '../redux/slices/paymentSlice';
import { setEditing } from '../redux/slices/statusSlice';
import PlayersPicker from '../components/PlayersPicker';

interface RouteParams {
  type: 'future' | 'ongoing';
  id?: number | string;
  playerId?: number | string;
  fee?: number;
  effectiveFrom?: {
    month: number;
    year: number;
  };
  selectablePlayers: any[];
}

const CreatePaymentPlan = ({ navigation, route }) => {
  const players = useSelector((state: RootState) => state.player.players);
  const futurePlans = useSelector(
    (state: RootState) => state.payment.paymentPlans.future
  );
  const dispatch = useDispatch<AppDispatch>();
  const { type, id, fee, effectiveFrom, playerId }: RouteParams = route.params;
  const date = new Date();

  const getMinForFuturePlan = () => {
    const manipulator = new Date();
    manipulator.setMonth(manipulator.getMonth() + 1);
    return {
      month: manipulator.getMonth(),
      year: manipulator.getFullYear(),
    };
  };

  const paymentPlanValidationSchema = Yup.object().shape({
    playerId: Yup.number().required('Player is required.'),
    fee: Yup.number()
      .integer('Cents are not allowed.')
      .min(1, 'Fee must be at least an rupee.')
      .required('Fee is required.'),
    effectiveFrom: Yup.object()
      .required('Effective date is required.')
      .shape({
        month: Yup.number()
          .integer('Selected month is invalid.')
          .min(0, 'Selected month is invalid.')
          .max(11, 'Selected month is invalid.')
          .required('Month is required.'),
        year: Yup.number()
          .integer('Selected year is invalid.')
          .required('Year is required.'),
      }),
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ display: 'flex', alignItems: 'center' }}>
        <Formik
          initialValues={{
            playerId: playerId || null,
            fee: fee ? fee.toString() : '',
            effectiveFrom: effectiveFrom || null,
          }}
          validateOnBlur={false}
          validationSchema={paymentPlanValidationSchema}
          onSubmit={(values: any) =>
            (id
              ? dispatch(updatePlan({ id, type, data: values }))
              : dispatch(createPlan(values))
            )
              .unwrap()
              .then(() => {
                ToastAndroid.showWithGravity(
                  `Payment plan ${id ? 'updated' : 'created'} successfully.`,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
                dispatch(setEditing(false));
                navigation.goBack();
              })
              .catch((error) => {
                ToastAndroid.showWithGravity(
                  error,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              })
          }>
          {({
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            touched,
          }) => (
            <>
              <PlayersPicker
                placeholder="Player"
                players={
                  id
                    ? players
                    : players.filter(
                        (player) =>
                          !futurePlans.find(
                            (plan) => plan.playerId === player.id
                          )
                      )
                }
                disabled={type === 'ongoing'}
                emptyMessage="No players found."
                selected={values.playerId}
                error={touched.playerId && (errors.playerId as string)}
                onBlur={() => setFieldTouched('playerId', true, true)}
                onChangeSelection={(value) => setFieldValue('playerId', value)}
              />
              <TextInput
                length="long"
                placeholder="Fee"
                onChangeText={(text) => setFieldValue('fee', text)}
                value={values.fee}
                onBlur={(event) => setFieldTouched('fee', true, true)}
                keyboardType="number-pad"
                error={touched.fee && (errors.fee as string)}
              />
              <MonthYearPicker
                placeholder="Effective from"
                disabled={type === 'ongoing'}
                title="Effective from"
                value={values.effectiveFrom}
                min={
                  type === 'future' ? { ...getMinForFuturePlan() } : undefined
                }
                max={
                  type === 'ongoing'
                    ? { year: date.getFullYear(), month: date.getMonth() }
                    : undefined
                }
                error={errors.effectiveFrom}
                onBlur={() => setFieldTouched('effectiveFrom', true, true)}
                onSelect={(value) => setFieldValue('effectiveFrom', value)}
              />
              <View style={{ marginTop: 40 }}>
                <Button
                  length="long"
                  style="filled"
                  color={Colors.DEEP_TEAL}
                  text={id ? 'Save' : 'Create'}
                  onPress={handleSubmit}
                />
                <Button
                  length="long"
                  style="outlined"
                  color={Colors.DEEP_TEAL}
                  text="Cancel"
                  onPress={() => {
                    navigation.goBack();
                    dispatch(setEditing(false));
                  }}
                />
              </View>
            </>
          )}
        </Formik>
      </ScrollView>
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

export default CreatePaymentPlan;
