import React from 'react';
import { ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import ChildInputWithPlayers from '../components/ChildInputWithPlayers';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { createPayments } from '../redux/slices/paymentSlice';

const CreatePayments = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const players = useSelector((state: RootState) => state.player.players);

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
            details: [],
          }}
          onSubmit={(values) =>
            dispatch(createPayments(values))
              .unwrap()
              .then(() => {
                navigation.goBack();
                ToastAndroid.showWithGravity(
                  'Player created successfully.',
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
          {({ handleSubmit, setFieldValue, values, errors }) => (
            <>
              <ChildInputWithPlayers
                players={players}
                placeholder="Select Payers"
                values={values.details}
                errors={errors.details as { values: object }[]}
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
                  text="Create"
                  onPress={handleSubmit}
                />
                <Button
                  length="long"
                  style="outlined"
                  color={Colors.DEEP_TEAL}
                  text="Cancel"
                  onPress={() => navigation.goBack()}
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
