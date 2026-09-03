import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import appReducer from './appSlice';
import type { AppState } from './appSlice';

const persistConfig = {
  key: 'favouritePandals',
  storage,
  // UI state and should never be rehydrated on reload.
  whitelist: ['favourites'] as (keyof AppState)[],
};

const persistedReducer = persistReducer<AppState>(persistConfig, appReducer);

export const store = configureStore({
  reducer: {
    favourites: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

/** Derived from the store itself — always stays in sync with the reducer shape. */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
