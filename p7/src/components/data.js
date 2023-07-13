import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";


import { getUsers } from "../redux/user";
import { getNewPosts } from "../redux/post";
import { getComments } from "../redux/comment";

// Split into multiple components?
export default function Data () {
    const dispatch = useDispatch();

    // Current User

    const loginStatus = useSelector(state => state.users.currentUser.loggedIn);
    const user = useSelector(state => state.users.currentUser);
    if (loginStatus == true) {
        const {loggedIn, ...toStore} = user

        localStorage.setItem("user", JSON.stringify({
            ...toStore
        }))
    }
    else {
        if (localStorage.getItem('user')) {
            const currUser = JSON.parse(localStorage.getItem("user"))
            dispatch({type : "users/login", payload : currUser})
        }
    }

    // Users List

    const userStatus = useSelector(state => state.users.status);
    const postStatus = useSelector(state => state.posts.state);
    const commentStatus = useSelector(state => state.comments.state);
    const usersDict = useSelector(state => state.users.dict);
    
    useEffect (() => {
        if (userStatus === "unloaded") {
            dispatch(getUsers());
        }
        if (postStatus === "unloaded") {
            dispatch(getNewPosts());
        }
        if (commentStatus === "unloaded") {
            dispatch(getComments());
        }
    }, [dispatch, userStatus, postStatus, commentStatus])
}

// Have this have like a "user" object and stuff that other files can import so they don't have to keep using useSelector