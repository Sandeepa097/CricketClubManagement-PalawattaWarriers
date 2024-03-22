import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Welcome from '../screens/Welcome';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import BottomTabNavigator from './BottomTabNavigator';
import SubHeader from '../headers/SubHeader';
import OppositeTeamMatches from '../screens/OppositeTeamMatches';
import Scorecard from '../screens/Scorecard';
import CreateMatch from '../screens/CreateMatch';
import CreatePlayer from '../screens/CreatePlayer';
import OverviewPlayer from '../screens/OverviewPlayer';
import CreatePayments from '../screens/CreatePayments';
import CreatePaymentPlan from '../screens/CreatePaymentPlan';

const Stack = createStackNavigator();

const AppNavigator = ({
  initialRouteName,
}: {
  initialRouteName: NavigationRoutes;
}) => (
  <Stack.Navigator initialRouteName={initialRouteName}>
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
      name={NavigationRoutes.OPPOSITE_TEAM_MATCHES}
      component={OppositeTeamMatches}
      options={{ header: () => <SubHeader title="Matches List" /> }}
    />
    <Stack.Screen
      name={NavigationRoutes.SCORECARD}
      component={Scorecard}
      options={{ header: () => <SubHeader title="Scorecard" /> }}
    />
    <Stack.Screen
      name={NavigationRoutes.CREATE_MATCH}
      component={CreateMatch}
      options={{
        header: () => <SubHeader title="New Match" onEditTitle="Edit Match" />,
      }}
    />
    <Stack.Screen
      name={NavigationRoutes.CREATE_PLAYER}
      component={CreatePlayer}
      options={{
        header: () => (
          <SubHeader title="New Player" onEditTitle="Edit Player" />
        ),
      }}
    />
    <Stack.Screen
      name={NavigationRoutes.OVERVIEW_PLAYER}
      component={OverviewPlayer}
      options={{ header: () => <SubHeader title="Overview Player" /> }}
    />
    <Stack.Screen
      name={NavigationRoutes.CREATE_PAYMENTS}
      component={CreatePayments}
      options={{
        header: () => (
          <SubHeader title="New Payments" onEditTitle="Edit Payment" />
        ),
      }}
    />
    <Stack.Screen
      name={NavigationRoutes.CREATE_PAYMENT_PLAN}
      component={CreatePaymentPlan}
      options={{
        header: () => (
          <SubHeader title="New Future Plan" onEditTitle="Edit Payment Plan" />
        ),
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
