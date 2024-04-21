import { create } from 'apisauce';
import { API_URL } from '../config/config';
import { StatusCodes } from 'http-status-codes';
import { logout, restoreAuth } from '../redux/slices/authSlice';
import { setLoading } from '../redux/slices/statusSlice';
import * as SecureStore from 'expo-secure-store';

let store: any;

export const injectStore = (injectingStore: any) => {
  store = injectingStore;
};

const api = create({
  baseURL: API_URL,
});

api.addRequestTransform((req) => {
  const accessToken = store.getState().auth.token;
  if (!accessToken) return;
  req.headers['Authorization'] = 'Bearer ' + accessToken;
});

api.axiosInstance.interceptors.request.use(
  (config) => {
    store.dispatch(setLoading(true));
    return config;
  },
  (error) => {
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

api.axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch(setLoading(false));
    return response;
  },
  async (error) => {
    if (error.response.status === StatusCodes.UNAUTHORIZED) {
      try {
        await refreshToken();
        return api.any(error.config);
      } catch (err) {
        store.dispatch(logout());
      }
    }
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  try {
    const storedValues: string = await SecureStore.getItemAsync('auth');

    if (storedValues) {
      const parsedValues = JSON.parse(storedValues);

      const response: any = await fetch(`${API_URL}/auth/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: parsedValues?.refreshToken }),
      });
      const data = await response.json();

      if (response.status !== StatusCodes.UNAUTHORIZED && data.accessToken) {
        const authDetails = JSON.stringify({
          ...parsedValues,
          token: data.accessToken,
        });
        await SecureStore.setItemAsync('auth', authDetails);
        store.dispatch(restoreAuth());
        return;
      }

      return Promise.reject(response);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

export default api;
