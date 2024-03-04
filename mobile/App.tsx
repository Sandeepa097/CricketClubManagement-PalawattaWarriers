import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BackgroundImage from './assets/BackgroundImage';
import MainNavigationContainer from './navigation/MainNavigationContainer';

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

  useCallback(async () => {
    if (!appLoading) {
      await SplashScreen.hideAsync();
    }
  }, [appLoading]);

  if (appLoading) return null;

  return (
    <>
      <StatusBar style="auto" />
      <BackgroundImage />
      <SafeAreaProvider>
        <MainNavigationContainer />
      </SafeAreaProvider>
    </>
  );
}
