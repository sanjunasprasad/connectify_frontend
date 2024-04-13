import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  chats: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat:(state, action)  =>{
      state.chats = action.payload;
    },
  },
});

export const { addChat } = chatSlice.actions;
export default chatSlice.reducer;
