import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import Matches from '../screens/Matches';
import Leaderboard from '../screens/Leaderboard';
import Players from '../screens/Players';
import Payments from '../screens/Payments';
import MainHeader from '../headers/MainHeader';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../constants/Colors';
import {
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import PaymentsIcon from '../assets/PaymentsIcon';
import PlayersIcon from '../assets/PlayersIcon';
import LeaderboardIcon from '../assets/LeaderboardIcon';
import MatchesIcon from '../assets/MatchesIcon';

const width: number = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const BottomTabBar = ({ state, descriptors, navigation }) => (
  <View style={styles.container}>
    {state.routes.map((route, index) => {
      const { options } = descriptors[route.key];

      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
        }
      };

      return (
        <TouchableOpacity
          key={index}
          style={styles.iconContainer}
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          testID={options.tabBarTestID}
          onPress={onPress}>
          <options.tabBarIcon focused={isFocused} />
          <Text
            style={{
              color: isFocused ? Colors.DEEP_TEAL : Colors.OFF_WHITE,
              fontFamily: 'Anybody-Regular',
              fontSize: 12,
            }}>
            {options.tabBarLabel}
          </Text>
        </TouchableOpacity>
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
        tabBarIcon: (props) => (
          <MatchesIcon
            size={30}
            fill={props.focused ? Colors.DEEP_TEAL : Colors.OFF_WHITE}
            shadow={false}
          />
        ),
        tabBarLabel: 'Matches',
      }}
    />
    <Tab.Screen
      name={NavigationRoutes.LEADERBOARD}
      component={Leaderboard}
      options={{
        header: () => <MainHeader title="Leaderboard" />,
        tabBarIcon: (props) => (
          <LeaderboardIcon
            size={30}
            fill={props.focused ? Colors.DEEP_TEAL : Colors.OFF_WHITE}
            shadow={false}
          />
        ),
        tabBarLabel: 'Leaderboard',
      }}
    />
    <Tab.Screen
      name={NavigationRoutes.PLAYERS}
      component={Players}
      options={{
        header: () => <MainHeader title="Players" />,
        tabBarIcon: (props) => (
          <PlayersIcon
            size={30}
            fill={props.focused ? Colors.DEEP_TEAL : Colors.OFF_WHITE}
            shadow={false}
          />
        ),
        tabBarLabel: 'Players',
      }}
    />
    <Tab.Screen
      name={NavigationRoutes.PAYMENTS}
      component={Payments}
      options={{
        header: () => <MainHeader title="Payments" />,
        tabBarIcon: (props) => (
          <PaymentsIcon
            size={30}
            fill={props.focused ? Colors.DEEP_TEAL : Colors.OFF_WHITE}
            shadow={false}
          />
        ),
        tabBarLabel: 'Payments',
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
    backgroundColor: Colors.LIGHT_TEAL,
    borderTopColor: Colors.TINT,
    borderTopWidth: 4,
  },
  iconContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export default BottomTabNavigator;
