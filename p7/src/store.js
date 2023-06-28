import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./redux/post";
import userReducer from "./redux/user";
import commentsReducer from "./redux/comment";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        user: userReducer,
        comments: commentsReducer,
    }
});
  
export default store;