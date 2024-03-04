import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Welcome from '../screens/Welcome';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="WelcomeScreen">
    <Stack.Screen
      name="LoginScreen"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="WelcomeScreen"
      component={Welcome}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
