import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getPosts = createAsyncThunk('posts/getPosts', async () => {
    const res = await fetch('http://localhost:3001/api/posts/get');
    const data = await res.json();
    console.log(data);
    return data['posts'];
})

const initialState = {
    state : "initial",
    list : [],
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: { // These need to be run after the async call to actually update posts in the database
        create: (state, action) => {
            console.log("Create Post");
        },
        update: (state, action) => {
            console.log("Update post"); 
        },
        remove: (state, action) => {
            console.log("Remove post");
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getPosts.pending, (state, action) => {
                state.state = 'loading';
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.state = 'loaded';
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.state = 'rejected';
            })
    }
})

export const { create, update, remove } = postSlice.actions;

export default postSlice.reducer;