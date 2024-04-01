import React from 'react';
import { View, StyleSheet, Dimensions, ToastAndroid } from 'react-native';
import { Colors } from '../constants/Colors';
import LogoWithName from '../assets/LogoWithName';
import Button from '../components/base/Button';
import TextInput from '../components/base/TextInput';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { login } from '../redux/slices/authSlice';
import { UserTypes } from '../constants/UserTypes';
import { StatusCodes } from 'http-status-codes';

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const Login = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const loginValidationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required.'),
    password: Yup.string().required('Password is required.'),
  });

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <LogoWithName width={0.419 * width} height={0.194 * height} />
      <View style={styles.divider}></View>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={(values) =>
          dispatch(login({ type: UserTypes.ADMIN, ...values }))
            .unwrap()
            .catch((error) => {
              ToastAndroid.showWithGravity(
                error.status === StatusCodes.UNAUTHORIZED
                  ? error.data.message
                  : 'Something went wrong. Please try again later.',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            })
        }>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={styles.form}>
              <TextInput
                name="username"
                length="short"
                placeholder="Username"
                value={values.username}
                error={touched.username && errors.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
              />
              <TextInput
                name="password"
                type="password"
                length="short"
                placeholder="Password"
                value={values.password}
                error={touched.password && errors.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
              />
            </View>
            <Button
              length="short"
              style="filled"
              color={Colors.DEEP_TEAL}
              text="Sign in"
              onPress={handleSubmit}
            />
          </>
        )}
      </Formik>
      <Button
        length="short"
        style="outlined"
        color={Colors.DEEP_TEAL}
        text="Cancel"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  divider: {
    marginTop: 0.043 * height,
    marginBottom: 0.043 * height,
    width: 0.798 * width,
    height: 1,
    backgroundColor: Colors.WHITE,
  },
  form: {
    marginBottom: 0.043 * height - 10,
  },
});

export default Login;
