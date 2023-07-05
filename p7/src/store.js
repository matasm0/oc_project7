import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./redux/post";
import usersReducer from "./redux/user";
import commentsReducer from "./redux/comment";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        users: usersReducer,
        comments: commentsReducer,
    }
});
  
export default store;