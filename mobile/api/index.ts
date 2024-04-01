import { create } from 'apisauce';
import { API_URL } from '../config/config';
import { StatusCodes } from 'http-status-codes';
import { logout } from '../redux/slices/authSlice';

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

export default api;
