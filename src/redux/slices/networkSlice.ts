import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NetworkState {
  isConnected: boolean;
  lastChecked: string | null;
}

const initialState: NetworkState = {
  isConnected: true,
  lastChecked: null,
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      state.lastChecked = new Date().toISOString();
    },
  },
});

export const { setNetworkStatus } = networkSlice.actions;

export default networkSlice.reducer;
