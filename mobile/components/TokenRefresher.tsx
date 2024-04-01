import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_REFRESH_INTERVAL } from '../config/config';
import api from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { restoreAuth } from '../redux/slices/authSlice';
import { UserTypes } from '../constants/UserTypes';

const TokenRefresher = () => {
  const [intervalId, setIntervalId] = useState(null);
  const userType = useSelector((state: RootState) => state.auth.userType);
  const dispatch = useDispatch<AppDispatch>();

  const refreshToken = async () => {
    const storedValues: string = await SecureStore.getItemAsync('auth');

    if (storedValues) {
      const parsedValues = JSON.parse(storedValues);
      api.addRequestTransform(async (req) => {
        req.headers['Authorization'] = 'Bearer ' + parsedValues?.refreshToken;
      });

      const response: any = await api.post('/auth/access_token');
      if (response.ok) {
        const data = JSON.stringify({
          ...parsedValues,
          token: response.data.accessToken,
        });
        await SecureStore.setItemAsync('auth', data);
        dispatch(restoreAuth());
      }
    }
  };

  useEffect(() => {
    clearInterval(intervalId);
    // if (!userType || userType === UserTypes.GUEST) return;

    // refreshToken();
    // const refreshingInterval = setInterval(
    //   refreshToken,
    //   1000 * 60 * 60 * 24 * TOKEN_REFRESH_INTERVAL
    // );
    // setIntervalId(refreshingInterval);

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, [userType]);

  return <></>;
};

export default TokenRefresher;
