import React from 'react';
import { View, StyleSheet, ScrollView, ToastAndroid } from 'react-native';
import ImagePicker from '../components/base/ImagePicker';
import TextInput from '../components/base/TextInput';
import RollsPicker from '../components/RollsPicker';
import MonthYearPicker from '../components/MonthYearPicker';
import Button from '../components/base/Button';
import { Colors } from '../constants/Colors';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { createPlayer, updatePlayer } from '../redux/slices/playerSlice';
import { setEditing } from '../redux/slices/statusSlice';
import { AsyncThunk } from '@reduxjs/toolkit';

interface PlayerForm {
  id?: string | number;
  avatar: string;
  name: string;
  rolls: {
    mainRoll: 'batsman' | 'bowler' | 'allRounder';
    isCaptain: boolean;
    isWicketKeeper: boolean;
  };
  feesPayingSince: {
    month: number;
    year: number;
  };
}

const CreatePlayer = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const editPlayer = route.params;

  const submit = (
    values: PlayerForm,
    alertText: string,
    reducer: AsyncThunk<any, any, any>
  ) => {
    dispatch(reducer(values))
      .unwrap()
      .then(() => {
        ToastAndroid.showWithGravity(
          alertText,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
        navigation.goBack();
        dispatch(setEditing(false));
      })
      .catch((error) => {
        ToastAndroid.showWithGravity(
          error,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      });
  };

  const playerValidationSchema = Yup.object().shape({
    avatar: Yup.string().nullable(),
    name: Yup.string().required('Name is required.'),
    rolls: Yup.object({
      mainRoll: Yup.string()
        .oneOf(
          ['batsman', 'bowler', 'allRounder'],
          'Main roll should be batsman or bowler or all rounder.'
        )
        .required('Main roll (Batsman/Bowler/All Rounder) is required.'),
      isCaptain: Yup.boolean().notRequired(),
      isWicketKeeper: Yup.boolean().notRequired(),
    }).required('Rolls are required.'),
    feesPayingSince: Yup.object()
      .required('Fees paying since is required.')
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
          initialValues={
            !editPlayer
              ? {
                  avatar: '',
                  name: '',
                  rolls: null,
                  feesPayingSince: null,
                }
              : {
                  ...editPlayer,
                  rolls: {
                    mainRoll: editPlayer.mainRoll,
                    isCaptain: editPlayer.isCaptain,
                    isWicketKeeper: editPlayer.isWicketKeeper,
                  },
                }
          }
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={playerValidationSchema}
          onSubmit={(values) => {
            const formattedValues = {
              ...values,
              mainRoll: values.rolls.mainRoll,
              isCaptain: values.rolls.isCaptain,
              isWicketKeeper: values.rolls.isWicketKeeper,
            };

            if (editPlayer) {
              submit(
                { ...formattedValues, id: editPlayer.id },
                'Player updated successfully.',
                updatePlayer
              );
            } else {
              submit(
                formattedValues,
                'Player created successfully.',
                createPlayer
              );
            }
          }}>
          {({ handleSubmit, setFieldValue, values, errors }) => (
            <>
              <ImagePicker
                value={values.avatar}
                onChange={(value) => setFieldValue('avatar', value)}
              />
              <TextInput
                length="long"
                placeholder="Name"
                onChangeText={(text) => setFieldValue('name', text)}
                value={values.name}
                error={errors.name as string}
              />
              <RollsPicker
                value={values.rolls}
                error={
                  typeof errors.rolls === 'object'
                    ? (errors.rolls as any)?.mainRoll
                    : errors.rolls
                }
                onChangeValue={(selection) => setFieldValue('rolls', selection)}
              />
              <MonthYearPicker
                placeholder="Fees Paying Since"
                title="Fees Paying Since"
                value={values.feesPayingSince}
                error={errors.feesPayingSince}
                onSelect={(value) => setFieldValue('feesPayingSince', value)}
              />
              <View style={{ marginTop: 40 }}>
                <Button
                  length="long"
                  style="filled"
                  color={Colors.DEEP_TEAL}
                  text={editPlayer ? 'Save' : 'Create'}
                  onPress={handleSubmit}
                />
              </View>
            </>
          )}
        </Formik>
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

export default CreatePlayer;
