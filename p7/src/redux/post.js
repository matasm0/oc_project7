import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// export const getPosts = createAsyncThunk('posts/getPosts', async () => {
//     const res = await fetch('http://localhost:3001/api/posts/get');
//     const data = await res.json();
//     return data['posts'];
// });

export const getPosts = (state) => {
    let toReturn = Object.values(state.posts.dict);
    return toReturn.sort((a, b) => b.created - a.created);
};

export const getNewPosts = createAsyncThunk('posts/getNewPosts', async () => {
    const res = await fetch('http://localhost:3001/api/posts/get');
    const data = await res.json();
    if (res.status == 400) throw new Error(data['error'])
    return data['posts'];
});

export const getPostById = createAsyncThunk('posts/getPostId', async (id) => {
    const res = await fetch('http://localhost:3001/api/posts/get/' + id);
    const data = await res.json();
    if (res.status == 400) throw new Error(data['error'])
    return data['post'];
});

export const addLikeDislike = createAsyncThunk('posts/addLikeDislike', async(props) => {
    const {user, post, likeStatus} = props;
    const res = await fetch('http://localhost:3001/api/posts/like/' + post, {
        method : "POST",
        // FIX
        headers : {
            // "Authorization" : "Bearer " +,
            "Accept" : "application/json",
            "Content-Type" : "application/json"},
        body : JSON.stringify({
            userId : user,
            likeStatus : likeStatus,
        })
    })
    const data = await res.json();
    if (res.status == 400) throw new Error(data['error'])
    return data;
});

const initialState = {
    state : "unloaded",
    list : [],
    dict : {},

    current: {},
    currentState : "unloaded",

    error : "",
    currentOperationStatus: "idle",
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: { // These need to be run after the async call to actually update posts in the database
        createPost: (state, action) => {
            console.log(action.payload)
            state.list = state.list.concat(action.payload);
            state.dict[action.payload.id] = action.payload;
        },
        update: (state, action) => {
            console.log("Update post"); 
        },
        remove: (state, action) => {
            delete state.dict[action.payload];
        },
        unload: (state, action) => {
            state.current = {};
            state.currentState = "unloaded";
        },
        clearError: (state, action) => {
            state.currentOperationStatus = "idle";
            state.error = "";
        },
        logout: (state, action) => {
            return initialState;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getNewPosts.pending, (state, action) => {
                state.state = 'loading';
            })
            .addCase(getNewPosts.fulfilled, (state, action) => {
                state.state = 'loaded';
                state.list = state.list.concat(action.payload);
                action.payload.forEach(post => {
                    state.dict[post.id] = post;
                });
            })
            .addCase(getNewPosts.rejected, (state, action) => {
                state.state = 'rejected';
                state.error = "Failed to get new posts";
            })
            .addCase(getPostById.pending, (state, action) => {
                state.currentState = 'loading'
            })
            .addCase(getPostById.fulfilled, (state, action) => {
                state.currentState = 'loaded';
                state.current = action.payload;
            })
            .addCase(getPostById.rejected, (state, action) => {
                state.currentState = 'rejected';
                state.error = "Failed to get post";
            })
            .addCase(addLikeDislike.fulfilled, (state, action) => {
                state.dict[action.payload.id] = action.payload;
                if (state.current.id == action.payload.id) 
                    state.current = action.payload;
            })
    }
})

export const { createPost, update, remove } = postSlice.actions;

export default postSlice.reducer;