import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./redux/post"

const store = configureStore({
    reducer: {
        posts: postsReducer,
    },
});
  
export default store;