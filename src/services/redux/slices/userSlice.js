// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
    },
    
  },
});

export const { setUser, setToken, clearUser } = userSlice.actions;

export default userSlice.reducer;
