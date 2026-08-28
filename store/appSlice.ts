import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { GanpatiPandal } from '@/types/global';

export interface FavouritePandal {
  name: string;
  lat: number;
  lng: number;
}

export interface AppState {
  favourites: FavouritePandal[];
  searchSelectedPandal: GanpatiPandal | null;
}

const initialState: AppState = {
  favourites: [],
  searchSelectedPandal: null,
};

const appSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<FavouritePandal>) => {
      if (!state.favourites.some(p => p.name === action.payload.name)) {
        state.favourites.push(action.payload);
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.favourites = state.favourites.filter(p => p.name !== action.payload);
    },
    setSearchSelectedPandal: (state, action: PayloadAction<GanpatiPandal | null>) => {
      state.searchSelectedPandal = action.payload;
    },
  },
});

export const { addFavourite, removeFavourite, setSearchSelectedPandal } = appSlice.actions;
export default appSlice.reducer;

