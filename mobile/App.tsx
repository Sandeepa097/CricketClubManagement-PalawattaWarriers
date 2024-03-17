import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BackgroundImage from './assets/BackgroundImage';
import MainNavigationContainer from './navigation/MainNavigationContainer';
import { Colors } from './constants/Colors';

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Anybody-Regular': require('./assets/fonts/Anybody-Regular.ttf'),
      });
      setAppLoading(false);
    };

    loadFont();
  });

  const onLayoutRender = useCallback(async () => {
    if (!appLoading) {
      await SplashScreen.hideAsync();
    }
  }, [appLoading]);

  if (appLoading) return null;

  return (
    <>
      <StatusBar backgroundColor={Colors.LIGHT_TEAL} />
      <BackgroundImage />
      <SafeAreaProvider onLayout={onLayoutRender}>
        <MainNavigationContainer />
      </SafeAreaProvider>
    </>
  );
}
