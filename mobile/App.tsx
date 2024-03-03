import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import BackgroundImage from './assets/BackgroundImage';
import Welcome from './screens/Welcome';

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
    <View style={styles.container}>
      <StatusBar style="auto" />
      <BackgroundImage />
      <Welcome />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
