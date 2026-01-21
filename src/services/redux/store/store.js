import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import postReducer from '../slices/postSlice';
import userReducer from '../slices/userSlice';
import chatReducer from '../slices/chatSlice'; 

const rootReducer = combineReducers({
  post: postReducer,
  user: userReducer,
  chat: chatReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});
export const persistor = persistStore(store);
export default { store, persistor }; 






// import { configureStore } from '@reduxjs/toolkit';
// import postReducer from '../slices/postSlice'; // all reducer fn defined in reducer object in slice
// import userReducer from '../slices/userSlice';
// import chatReducer from '../slices/chatSlice'; 

// const store = configureStore({
//   reducer: {
//     post: postReducer,
//     user: userReducer,
//     chat: chatReducer, 
//   },
// });

// export default store;