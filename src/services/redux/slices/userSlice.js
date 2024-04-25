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
    clearUserState(state) {
      Object.assign(state, initialState);
    },
    
  },
});

export const { setUser, setToken, clearUserState } = userSlice.actions;

export default userSlice.reducer;
