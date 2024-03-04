import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Colors } from '../constants/Colors';
import LogoWithName from '../assets/LogoWithName';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const Login = ({ navigation }) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const login = () => console.log('login');
  const goBack = () => navigation.goBack();

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={styles.container}>
        <LogoWithName width={0.419 * width} height={0.194 * height} />
        <View style={styles.divider}></View>
        <View style={styles.form}>
          <TextInput
            length="short"
            placeholder="Username"
            value={username}
            onChangeText={setUserName}
          />
          <TextInput
            type="password"
            length="short"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Button
          length="short"
          style="filled"
          color={Colors.DEEP_TEAL}
          text="Sign in"
          onPress={login}
        />
        <Button
          length="short"
          style="outlined"
          color={Colors.DEEP_TEAL}
          text="Cancel"
          onPress={goBack}
        />
      </View>
    </KeyboardAvoidingView>
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
