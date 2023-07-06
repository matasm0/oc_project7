import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./post";
import usersReducer from "./user";
import commentsReducer from "./comment";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        users: usersReducer,
        comments: commentsReducer,
    }
});
  
export default store;