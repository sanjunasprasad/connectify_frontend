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
    clearChatState: state => {
      state.chats = null;
    },
  },
});

export const { addChat , clearChatState} = chatSlice.actions;
export default chatSlice.reducer;
