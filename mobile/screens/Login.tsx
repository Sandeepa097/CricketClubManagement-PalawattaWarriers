import React from 'react';
import { Text, View } from 'react-native';
import BackgroundImage from '../assets/BackgroundImage';

interface LoginProps {
  title?: string;
}

function Login(props: LoginProps) {
  return (
    <View style={{ backgroundColor: 'blue' }}>
      <Text>{props.title ? props.title : 'Hey this is login'}</Text>
    </View>
  );
}

export default Login;
