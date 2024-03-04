import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import AppNavigator from './AppNavigator';
import { navigationRef } from './rootNavigation';

const MainNavigationContainer = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        justifyContent: 'center',
      }}>
      <NavigationContainer
        ref={navigationRef}
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
          },
        }}>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
};

export default MainNavigationContainer;
