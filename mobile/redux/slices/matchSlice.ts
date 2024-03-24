import { createSlice } from '@reduxjs/toolkit';
import { OutdoorMatch, PPLMatch } from '../../types';

interface MatchState {
  outdoors: OutdoorMatch[];
  ppls: PPLMatch[];
}

const initialState: MatchState = {
  outdoors: [],
  ppls: [],
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {},
});

export default matchSlice.reducer;
