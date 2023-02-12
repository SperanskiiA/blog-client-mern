import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const { data } = await axios.get('/comments');
    return data;
  }
);

export const removeComment = createAsyncThunk(
  'comments/removeComment',
  async (id) => {
    await axios.delete(`/comments/${id}`);
  }
);

const initialState = {
  comments: {
    items: [],
    status: 'loading',
  },
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchComments.pending]: (state) => {
      state.comments.status = 'loading';
      state.comments.items = null;
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.status = 'loaded';
      state.comments.items = action.payload;
    },
    [fetchComments.rejected]: (state) => {
      state.comments.status = 'error';
      state.comments.items = null;
    },
    [removeComment.rejected]: (state) => {
      state.comments.status = 'error';
    },
    [removeComment.pending]: (state, action) => {
      state.comments.items = state.comments.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
    },
  },
});

export const commentReducer = commentSlice.reducer;
