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
    if (res.status == 400) throw new Error(data['error'])
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
    if (res.status == 400) throw new Error(data['error'])
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
    if (res.status == 400) throw new Error(data['error'])
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
    dict : {},
    error : "",
    currentOperationStatus: "idle",
}


// Any time we update currentUser, we need to update that user in the dict as well
const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser = {...action.payload};
            state.currentUser.loggedIn = true;
        },
        logout: (state, action) => {
            localStorage.removeItem("user");
            state.currentUser = {loggedIn : false};
        },
        updateUser: (state, action) => {
            state.currentUser = {...state.currentUser, ...action.payload};
        },
        clearError: (state, action) => {
            state.currentOperationStatus = "idle";
            state.error = "";
        }
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
            .addCase(getUsers.rejected, (state, action) => {
                state.status = "rejected";
                state.error = "Failed to get users";
            })
            .addCase(addLikeDislikePost.pending, (state, action) => {
                state.currentOperationStatus = "pending";
            })
            .addCase(addLikeDislikePost.fulfilled, (state, action) => {
                state.currentOperationStatus = "idle";
                state.currentUser = {...state.currentUser, ...action.payload}
            })
            .addCase(addLikeDislikePost.rejected, (state, action) => {
                state.currentOperationStatus = "rejected";
                state.error = "Failed to like/dislike post";
            })
            .addCase(readPost.pending, (state, action) => {
                state.currentOperationStatus = "pending";
            })
            .addCase(readPost.fulfilled, (state, action) => {
                state.currentOperationStatus = "idle";
                state.currentUser = {...state.currentUser, ...action.payload}
            })
            .addCase(readPost.rejected, (state, action) => {
                state.currentOperationStatus = "rejected";
                state.error = "Couldn't add post to readList";
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