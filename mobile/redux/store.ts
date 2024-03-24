import { configureStore } from '@reduxjs/toolkit';
import statusReducer from './slices/statusSlice';
import authReducer from './slices/authSlice';
import playerReducer from './slices/playerSlice';
import matchReducer from './slices/matchSlice';
import teamReducer from './slices/teamSlice';

const store = configureStore({
  reducer: {
    status: statusReducer,
    auth: authReducer,
    player: playerReducer,
    match: matchReducer,
    team: teamReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
