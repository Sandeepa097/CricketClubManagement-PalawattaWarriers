import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import { registerRootComponent } from 'expo';

function AppEntry() {
  SplashScreen.preventAutoHideAsync();
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

registerRootComponent(AppEntry);
