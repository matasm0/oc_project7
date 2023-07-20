import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUsers = createAsyncThunk("users/getUsers", async () => {
    const res = await fetch('http://localhost:3001/api/users/get');
    const data = await res.json();
    return data['usersList'];
});


// We will not check when these async functions fail because 1, it is hard to do with how I coded it, and 
// 2, we catch the failure in the post/comment/whereever else. If those fail, this should fail too. If one
// fails but the other doesn't, the effect is limited to a couple of like/dislike counts being off.
export const addLikeDislikePost = createAsyncThunk("users/addLikeDislikePost", async (props) => {
    const {user, post, likeStatus} = props;
    const res = await fetch('http://localhost:3001/api/users/likePost/' + user, {
        method : "POST",
        // FIX
        headers : {
            // "Authorization" : "Bearer " +,
            "Accept" : "application/json",
            "Content-Type" : "application/json"},
        body : JSON.stringify({
            postId : post,
            likeStatus : likeStatus,
        })
    })
    const data = await res.json();
    return data;
});

export const addLikeDislikeComment = createAsyncThunk("users/addLikeDislikeComment", async (props) => {
    const {user, comment, likeStatus} = props;
    const res = await fetch('http://localhost:3001/api/users/likeComment/' + user, 
    {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            commentId : comment,
            likeStatus : likeStatus
        })
    })
    const data = await res.json()
    return data;
})

export const readPost = createAsyncThunk("users/readPost", async (props) =>{
    const {user, post} = props;
    const res = await fetch('http://localhost:3001/api/users/readPost/' + user,
    {
        method : "POST",
        headers : {
            // Authorization
            "Content-Type" : "application/json"
        },
        body : JSON.stringify ({
            postId : post
        })
    })
    const data = await res.json();
    return data;
})

const initialState = {
    currentUser : {
        loggedIn : false,
        // email : "",
        // id : "", // Change to _id and just steal
        // token : "",
        // posts : [], // Maybe these refresh on refresh?
        // comments : [],
        // likedPosts : [],
        // dislikedPosts : [],
    },
    status : "unloaded",
    dict : {}
}


// Any time we update currentUser, we need to update that user in the dict as well
const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = {...action.payload};
            state.currentUser.loggedIn = true;
            // state.currentUser.id = action.payload.userId;
            // state.currentUser.email = action.payload.email;
            // state.currentUser.token = action.payload.token;
        },
        logout: (state, action) => {
            localStorage.removeItem("user");
            state.currentUser = {loggedIn : false};
        },
        updateUser: (state, action) => {
            state.currentUser = {...state.currentUser, ...action.payload};
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getUsers.pending, (state, action) => {
                state.status = "loading";
            })        
            .addCase(getUsers.fulfilled, (state, action) => {
                state.status = "loaded";
                action.payload.forEach(user => {
                    state.dict[user._id] = user;
                })
            })
            .addCase(addLikeDislikePost.fulfilled, (state, action) => {
                state.currentUser = {...state.currentUser, ...action.payload}
            })
            .addCase(readPost.fulfilled, (state, action) => {
                state.currentUser = {...state.currentUser, ...action.payload}
            })
    }
})

export const likeStatus = (state, postId, forPost = true) => {
    if (!forPost) {
        return (state.users.currentUser.likedComments.indexOf(postId) != -1) ? 1 :
               (state.users.currentUser.dislikedComments.indexOf(postId) != -1) ? -1 :
               0;
    }
    return (state.users.currentUser.likedPosts.indexOf(postId) != -1) ? 1 :
           (state.users.currentUser.dislikedPosts.indexOf(postId) != -1) ? -1 :
            0;
}

export const findUser = (state, userId) => {
    return state.users.dict[userId]
}

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;