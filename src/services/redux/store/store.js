import { configureStore } from '@reduxjs/toolkit';
import postReducer from '../slices/postSlice'; // all reducer fn defined in reducer object in slice
import userReducer from '../slices/userSlice';
import chatReducer from '../slices/chatSlice'; 

const store = configureStore({
  reducer: {
    post: postReducer,
    user: userReducer,
    chat: chatReducer, 
  },
});

export default store;