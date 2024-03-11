import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import Welcome from '../screens/Welcome';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import BottomTabNavigator from './BottomTabNavigator';
import CreatePlayer from '../screens/CreatePlayer';
import SubHeader from '../headers/SubHeader';
import OverviewPlayer from '../screens/OverviewPlayer';
import CreatePayments from '../screens/CreatePayments';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="WelcomeScreen">
    <Stack.Screen
      name={NavigationRoutes.WELCOME}
      component={Welcome}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={NavigationRoutes.LOGIN}
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={NavigationRoutes.HOME}
      component={BottomTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={NavigationRoutes.CREATE_PLAYER}
      component={CreatePlayer}
      options={{ header: () => <SubHeader title="New Player" /> }}
    />
    <Stack.Screen
      name={NavigationRoutes.OVERVIEW_PLAYER}
      component={OverviewPlayer}
      options={{ header: () => <SubHeader title="Overview Player" /> }}
    />
    <Stack.Screen
      name={NavigationRoutes.CREATE_PAYMENTS}
      component={CreatePayments}
      options={{ header: () => <SubHeader title="Create Payments" /> }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
