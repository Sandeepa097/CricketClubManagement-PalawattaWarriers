import React from 'react';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import ChildInputWithPlayers from '../components/ChildInputWithPlayers';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { createPayments, updatePayment } from '../redux/slices/paymentSlice';
import { setEditing } from '../redux/slices/statusSlice';

const CreatePayments = ({ route, navigation }) => {
  const editPayment = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const players = useSelector((state: RootState) => state.player.players);

  const paymentValidationSchema = Yup.object().shape({
    details: Yup.array()
      .of(
        Yup.object().shape({
          values: Yup.object().shape({
            amount: Yup.number()
              .integer('Cents not allowed.')
              .min(0, 'Amount is invalid.')
              .required('Amount is required.'),
          }),
        })
      )
      .min(1, 'Payers are required.'),
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <Formik
          initialValues={{
            details: editPayment
              ? [
                  {
                    id: editPayment.playerId,
                    values: { amount: editPayment.amount },
                  },
                ]
              : [],
          }}
          validationSchema={paymentValidationSchema}
          validateOnBlur={false}
          onSubmit={(values) =>
            (editPayment
              ? dispatch(
                  updatePayment({ id: editPayment.id, data: values.details[0] })
                )
              : dispatch(createPayments(values))
            )
              .unwrap()
              .then(() => {
                navigation.goBack();
                dispatch(setEditing(false));
                ToastAndroid.showWithGravity(
                  `Payment ${
                    editPayment ? 'updated' : 'created'
                  } successfully.`,
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
              <ChildInputWithPlayers
                players={players}
                placeholder="Select Payers"
                playerChangeDisabled={editPayment}
                values={values.details}
                errors={
                  touched.details &&
                  (errors.details as { values: object }[] | string)
                }
                onBlur={() => setFieldTouched('details', true, true)}
                onChangeValues={(details) => setFieldValue('details', details)}
                itemProperties={[
                  { type: 'text', name: 'amount', placeholder: 'Paid Amount' },
                ]}
              />
              <View style={{ marginTop: 40 }}>
                <Button
                  length="long"
                  style="filled"
                  color={Colors.DEEP_TEAL}
                  text={editPayment ? 'Save' : 'Create'}
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

export default CreatePayments;
