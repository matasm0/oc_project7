import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUsers = createAsyncThunk("user/getUsers", async () => {
    const res = await fetch('http://localhost:3001/api/users/get');
    const data = await res.json();
    return data['usersList'];
})

const initialState = {
    currentUser : {
        loggedIn : false,
        email : "",
        id : "", // Change to _id and just steal
        posts : [],
        comments : [],
    },
    status : "initial",
    dict : {}
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.currentUser.loggedIn = true;
            state.currentUser.id = action.payload.userId;
            state.currentUser.email = action.payload.email;
        },
        logout: (state, action) => {
            state = initialState;
            localStorage.removeItem("user");
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
    }
})

export const likeStatus = (state, postId) => {
    const userId = state.user.currentUser.id;
    return state.posts.list;
}

export const findUser = (state, userId) => {
    return state.user.dict[userId]
}

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;