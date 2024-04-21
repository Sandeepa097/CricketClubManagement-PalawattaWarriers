import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BackgroundImage from './assets/BackgroundImage';
import MainNavigationContainer from './navigation/MainNavigationContainer';
import { Colors } from './constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { restoreAuth } from './redux/slices/authSlice';
import LoadingIndicator from './components/LoadingIndicator';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [appLoading, setAppLoading] = useState(true);
  const processing = useSelector((state: RootState) => state.status.isLoading);

  useEffect(() => {
    const prepare = async () => {
      await Font.loadAsync({
        'Anybody-Regular': require('./assets/fonts/Anybody-Regular.ttf'),
      });
      await dispatch(restoreAuth()).unwrap();
      setAppLoading(false);
    };

    prepare();
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
        <>
          <LoadingIndicator active={processing} />
          <MainNavigationContainer />
        </>
      </SafeAreaProvider>
    </>
  );
};

export default App;
