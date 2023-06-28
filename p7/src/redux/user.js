import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loggedIn : false,
    email : "",
    id : "", // Change to _id and just steal
    posts : [],
    comments : []
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.loggedIn = true;
            state.id = action.payload;
        },
        logout: (state, action) => {
            state = initialState;
        }
    }
})

export const likeStatus = (state, postId) => {
    const userId = state.user.id;
    return state.posts.list
}

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;