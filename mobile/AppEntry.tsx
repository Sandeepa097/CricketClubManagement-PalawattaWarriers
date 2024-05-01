import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import { registerRootComponent } from 'expo';
import { injectStore } from './api';

function AppEntry() {
  SplashScreen.preventAutoHideAsync();
  injectStore(store);
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

registerRootComponent(AppEntry);
