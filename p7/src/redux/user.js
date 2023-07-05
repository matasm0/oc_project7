import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUsers = createAsyncThunk("users/getUsers", async () => {
    const res = await fetch('http://localhost:3001/api/users/get');
    const data = await res.json();
    return data['usersList'];
})

export const addLikeDislikePost = createAsyncThunk("users/addLikeDislike", async (props) => {
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
    status : "initial",
    dict : {}
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        default: (state, action) => {
            return state;
        },
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
            .addCase(addLikeDislikePost.fulfilled, (state, action) => {
                state.currentUser = {...state.currentUser, ...action.payload}
            })
    }
})

export const likeStatus = (state, postId) => {
    return (state.users.currentUser.likedPosts.indexOf(postId) != -1) ? 1 :
           (state.users.currentUser.dislikedPosts.indexOf(postId) != -1) ? -1 :
            0;
}

export const findUser = (state, userId) => {
    return state.users.dict[userId]
}

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;