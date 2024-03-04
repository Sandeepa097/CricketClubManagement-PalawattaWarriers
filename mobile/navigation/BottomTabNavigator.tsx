import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import Matches from '../screens/Matches';
import Leaderboard from '../screens/Leaderboard';
import Players from '../screens/Players';
import Payments from '../screens/Payments';
import MainHeader from '../headers/MainHeader';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { View, StyleSheet, Dimensions } from 'react-native';

const width: number = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: true,
    }}>
    <Tab.Screen
      name={NavigationRoutes.MATCHES}
      component={Matches}
      options={{
        header: () => <MainHeader title="Matches" />,
      }}
    />
    <Tab.Screen
      name={NavigationRoutes.LEADERBOARD}
      component={Leaderboard}
      options={{
        header: () => <MainHeader title="Leaderboard" />,
      }}
    />
    <Tab.Screen
      name={NavigationRoutes.PLAYERS}
      component={Players}
      options={{
        header: () => <MainHeader title="Players" />,
      }}
    />
    <Tab.Screen
      name={NavigationRoutes.PAYMENTS}
      component={Payments}
      options={{
        header: () => <MainHeader title="Payments" />,
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width,
    height: 70,
    padding: 10,
    backgroundColor: Colors.LIGHT_TEAL,
  },
});

export default BottomTabNavigator;
