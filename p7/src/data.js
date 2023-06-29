import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { getUsers } from "./redux/user";

// Split into multiple components?
export default function Data () {
    const dispatch = useDispatch();

    // Current User

    const loginStatus = useSelector(state => state.user.currentUser.loggedIn);
    const user = useSelector(state => state.user.currentUser);
    if (loginStatus == true) {
        // We only use id rn
        localStorage.setItem("user", JSON.stringify({
            userId : user.id,
            email : user.email,
        }))
    }
    else {
        if (localStorage.getItem('user')) {
            const currUser = JSON.parse(localStorage.getItem("user"))
            dispatch({type : "user/login", payload : currUser})
        }
    }

    // Users List

    const userStatus = useSelector(state => state.user.status);
    const usersDict = useSelector(state => state.user.dict);
    
    useEffect (() => {
        if (userStatus === "initial") {
            dispatch(getUsers());
        }
    }, [dispatch, userStatus])
}