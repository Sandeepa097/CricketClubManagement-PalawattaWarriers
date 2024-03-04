import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import Matches from '../screens/Matches';
import Leaderboard from '../screens/Leaderboard';
import Players from '../screens/Players';
import Payments from '../screens/Payments';
import MainHeader from '../headers/MainHeader';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Colors } from '../constants/Colors';

const width: number = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const BottomTabBar = ({ state, descriptors, navigation }) => (
  <View style={styles.container}>
    {state.routes.map((route, index) => {
      return (
        <View key={index}>
          <Text>{index}</Text>
        </View>
      );
    })}
  </View>
);

const BottomTabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width,
    height: 62,
    padding: 10,
    backgroundColor: Colors.LIGHT_TEAL,
    borderTopColor: Colors.TINT,
    borderTopWidth: 4,
  },
});

export default BottomTabNavigator;
