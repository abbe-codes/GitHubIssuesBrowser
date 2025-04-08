import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  error: string | null;
  darkMode: boolean;
}

const initialState: UIState = {
  isLoading: false,
  error: null,
  darkMode: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setError, toggleDarkMode, clearError } = uiSlice.actions;

export default uiSlice.reducer;
