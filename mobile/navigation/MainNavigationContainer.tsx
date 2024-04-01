import React, { useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import AppNavigator from './AppNavigator';
import { navigationRef } from './rootNavigation';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { NavigationRoutes } from '../constants/NavigationRoutes';
import TokenRefresher from '../components/TokenRefresher';

const MainNavigationContainer = () => {
  const insets = useSafeAreaInsets();
  const userType = useSelector((state: RootState) => state.auth.userType);

  useEffect(() => {
    const initialRouteName = userType
      ? NavigationRoutes.HOME
      : NavigationRoutes.WELCOME;
    navigationRef.current.reset({
      index: 0,
      routes: [{ name: initialRouteName }],
    });
  }, [userType]);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        justifyContent: 'center',
      }}>
      <TokenRefresher />
      <NavigationContainer
        ref={navigationRef}
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
          },
        }}>
        <AppNavigator
          initialRouteName={
            userType ? NavigationRoutes.HOME : NavigationRoutes.WELCOME
          }
        />
      </NavigationContainer>
    </View>
  );
};

export default MainNavigationContainer;
