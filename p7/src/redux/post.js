import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// export const getPosts = createAsyncThunk('posts/getPosts', async () => {
//     const res = await fetch('http://localhost:3001/api/posts/get');
//     const data = await res.json();
//     return data['posts'];
// });

export const getPosts = (state) => state.posts.list;

export const getNewPosts = createAsyncThunk('posts/getNewPosts', async () => {
    const res = await fetch('http://localhost:3001/api/posts/get');
    const data = await res.json();
    return data['posts'];
});

export const getPostById = createAsyncThunk('posts/getPostId', async (id) => {
    const res = await fetch('http://localhost:3001/api/posts/get/' + id);
    const data = await res.json();
    return data['post'];
});

// export const getPostLikeStatus = ()

// export const createPost = createAsyncThunk('posts/createPost', async () => {
//     const res = await fetch('http://localhost:3001/api/posts/create');
//     const data = await res.json();
//     console.log(data);
//     return data['post']
// })

const initialState = {
    state : "initial",
    list : [],

    current: null,
    currentState : "unloaded",
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: { // These need to be run after the async call to actually update posts in the database
        create: (state, action) => {
            state.list = state.list.concat(action.payload);
        },
        update: (state, action) => {
            console.log("Update post"); 
        },
        remove: (state, action) => {
            console.log("Remove post");
        },
        unload: (state, action) => {
            state.current = null;
            state.currentState = "unloaded";
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getNewPosts.pending, (state, action) => {
                state.state = 'loading';
            })
            .addCase(getNewPosts.fulfilled, (state, action) => {
                state.state = 'loaded';
                state.list = state.list.concat(action.payload);
            })
            .addCase(getNewPosts.rejected, (state, action) => {
                state.state = 'rejected';
            })
            .addCase(getPostById.pending, (state, action) => {state.currentState = 'loading'})
            .addCase(getPostById.fulfilled, (state, action) => {
                state.currentState = 'loaded';
                state.current = action.payload;
            })
    }
})

export const { create, update, remove } = postSlice.actions;

export default postSlice.reducer;