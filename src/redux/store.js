import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/auth';
import { commentReducer } from './slices/comment';
import { postsReducer } from './slices/post';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    comments: commentReducer,
  },
});

export default store;
