import { configureStore } from '@reduxjs/toolkit';
import issuesReducer from './slices/issuesSlice';
import uiReducer from './slices/uiSlice';
import networkReducer from './slices/networkSlice';

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
    ui: uiReducer,
    network: networkReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
