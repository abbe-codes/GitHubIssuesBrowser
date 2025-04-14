// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import issuesReducer from './issuesSlice';

// Configure the Redux store
// This creates our central state management system
const store = configureStore({
  reducer: {
    issues: issuesReducer,
  },
});

// Define RootState type for TypeScript
export type RootState = ReturnType<typeof store.getState>;
// Define AppDispatch type for TypeScript
export type AppDispatch = typeof store.dispatch;

export default store;
