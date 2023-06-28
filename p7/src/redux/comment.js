import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getCommentsPost = createAsyncThunk('comments/getCommentsPost', async (post) => {
    const postId = post['postId'];
    const res = await fetch(`http://localhost:3001/api/posts/comments/${postId}`);
    const data = await res.json();
    return data['comments'];
})

const initialState = {
    state: "initial",
    list: [], // Maybe pull and clear with each post?
    lib: {}
}

const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        create(state, action) {
            state.list.push(action.payload.comment)
            state.lib[action.payload.comment._id] = action.payload.comment;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getCommentsPost.fulfilled, (state, action) => {
                state.state = "loaded";
                state.list = state.list.concat(action.payload);
                // console.log(action);
            })
    }
})

export const { create } = commentSlice.actions;

export const getCommentById = (state, id) => state.lib[id] || {};

export default commentSlice.reducer;