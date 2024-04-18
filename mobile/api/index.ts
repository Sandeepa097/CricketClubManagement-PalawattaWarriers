import { create } from 'apisauce';
import { API_URL } from '../config/config';
import { StatusCodes } from 'http-status-codes';
import { logout } from '../redux/slices/authSlice';
import { setLoading } from '../redux/slices/statusSlice';

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

api.addResponseTransform((response) => {
  if (response.status === StatusCodes.UNAUTHORIZED) {
    store.dispatch(logout());
  }
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
  (error) => {
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

export default api;
