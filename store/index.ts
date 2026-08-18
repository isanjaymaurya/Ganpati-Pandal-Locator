import { configureStore } from '@reduxjs/toolkit';
import favouritePandalsReducer from './appSlice';
import type { AppState } from './appSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'favouritePandals',
  storage,
};

const persistedReducer = persistReducer<AppState>(persistConfig, favouritePandalsReducer);

export const store = configureStore({
  reducer: {
    favourites: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = {
  favourites: AppState;
};
export type AppDispatch = typeof store.dispatch;
