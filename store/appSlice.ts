import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FavouritePandal {
  name: string;
  lat: number;
  lng: number;
}

export interface AppState {
  favourites: FavouritePandal[];
}

const initialState: AppState = {
  favourites: [],
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
    setFavourites: (state, action: PayloadAction<FavouritePandal[]>) => {
      state.favourites = action.payload;
    },
  },
});

export const { addFavourite, removeFavourite, setFavourites } = appSlice.actions;
export default appSlice.reducer;

