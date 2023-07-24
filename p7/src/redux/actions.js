import { useSelector } from "react-redux";

import { addLikeDislikePost as uAddLikeDislikePost } from "./user";
import { addLikeDislike as pAddLikeDislike } from "./post";

import { addLikeDislikeComment as uAddLikeDislikeComment } from "./user";
import { addLikeDislike as cAddLikeDislike, getCommentsChildren } from "./comment";


export const addLikeDislikePost = (user, post, likeStatus) => {
    return (dispatch, state) => {
        dispatch(uAddLikeDislikePost({user : user.id, post : post.id, likeStatus : likeStatus}));
        dispatch(pAddLikeDislike({user : user.id, post : post.id, likeStatus : likeStatus}));
    }
}

export const addLikeDislikeComment = (user, comment, likeStatus) => {
    return (dispatch, state) => {
        dispatch(uAddLikeDislikeComment({user : user.id, comment : comment.id, likeStatus : likeStatus}));
        dispatch(cAddLikeDislike({user : user.id, comment : comment.id, likeStatus : likeStatus}));
    }
}

export const logout = () => {
    return (dispatch, state) => {
        dispatch({type : "users/logout"});
        dispatch({type : "posts/logout"});
        dispatch({type : "comments/logout"});
    }
}

// Returns all of the relevant information that a component rendering a post will use
export const PostInfo = (postId) => {
    let toReturn = {
        author : {
            status : "unloaded",
            username : "",
            email : "",
            pfp : "",
            id : "",
        },
        post : {
            status : "unloaded",
            title : "",
            id : postId,
            image : "",
            likes : -1,
            dislikes : -1,
            created : -1,
        },
    }

    let post = {}, author = {};

    // Check if the post we want is the current post. If so, use it as it is the most up to date
    const currentStatus = useSelector(state => state.posts.currentState);
    const current = useSelector(state => state.posts.current);

    const postStatus = useSelector(state => state.posts.state);
    const postsDict = useSelector(state => state.posts.dict); // Make a selector

    const usersStatus = useSelector(state => state.users.status);
    const usersDict = useSelector(state => state.users.dict);

    // Need an elegant way to throw and catch errors
    if (postId == undefined) {
        return "YOU NEED TO PASS IN AN ID MAN";
    }
    
    // Haha! This needs to be an if if not if else if
    if (currentStatus === 'loaded') {
        if (current && current.id == postId)
            post = current;
            toReturn.post.status = "loaded";
    }

    // Else pull it out of the post dict
    else if (postStatus === 'loaded') {
        if (postId in postsDict) {
            post = postsDict[postId];
            toReturn.post.status = "loaded";
        }
        else {
            // Post was not found. Return and let caller handle
            toReturn.post.status = "missing";
            return toReturn;
        }
    }

    // Neither currentpost nor post dict loaded, return to be dispatched
    else return toReturn;

    // Could check for deleted and such here, leaving it to caller
    toReturn.post.title = post.title;
    toReturn.post.image = post.imageUrl;
    toReturn.post.likes = post.likes;
    toReturn.post.dislikes = post.dislikes;
    toReturn.post.created = post.created;

    
    // Userslist is not loaded
    if (usersStatus === "unloaded") {
        return toReturn;
    }

    if (post.userId in usersDict) {
        toReturn.author.status = "loaded";
        author = usersDict[post.userId];
    }
    else {
        toReturn.author.status = "missing";
        return toReturn;
    }

    toReturn.author.id = author.id;
    toReturn.author.email = author.email;
    toReturn.author.username = author.username;
    toReturn.author.pfp = author.pfp;

    return toReturn;
}

export const CommentInfo = (commentId) => {
    let toReturn = {
        author : {
            status : "unloaded",
            username : "",
            email : "",
            pfp : "",
            id : "",
        },
        comment : {
            status : "unloaded",
            content : "",
            id : commentId,
            likes : -1,
            dislikes : -1,
            children : [],
            parent : "",
            postParent : "",
            created : -1,
        }
    }

    let comment = {}, author = {};

    const commentsStatus = useSelector(state => state.comments.state);
    const commentsDict = useSelector(state => state.comments.dict);
    const tempChildren = useSelector(state => getCommentsChildren(state, commentId))

    const usersStatus = useSelector(state => state.users.status);
    const usersDict = useSelector(state => state.users.dict);

    if (commentId == undefined) {
        return "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    }

    if (commentsStatus == 'loaded') {
        if (commentId in commentsDict) {
            comment = commentsDict[commentId]
            toReturn.comment.status = "loaded";
        }
        else {
            toReturn.comment.status = "missing";
            return toReturn;
        }
    }

    else return toReturn;

    toReturn.comment.content = comment.content;
    toReturn.comment.likes = comment.likes;
    toReturn.comment.dislikes = comment.dislikes;
    // toReturn.comment.children = comment.children;
    toReturn.comment.children = tempChildren;
    toReturn.comment.parent = comment.parent;
    toReturn.comment.postParent = comment.postParent;
    toReturn.comment.created = comment.created;

    if (usersStatus === "unloaded") {
        return toReturn;
    }

    if (comment.author in usersDict) {
        toReturn.author.status = "loaded";
        author = usersDict[comment.author];
    }
    else {
        toReturn.author.status = "missing";
        return toReturn;
    }

    toReturn.author.id = author.id;
    toReturn.author.email = author.email;
    toReturn.author.username = author.username;
    toReturn.author.pfp = author.pfp;

    return toReturn;
}

// if userId is "current", return current user
export const UserInfo = (userId) => {

}