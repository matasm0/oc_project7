import { useSelector } from "react-redux";

import { addLikeDislikePost as uAddLikeDislikePost } from "./user";
import { addLikeDislike as pAddLikeDislike } from "./post";

import { addLikeDislikeComment as uAddLikeDislikeComment } from "./user";
import { addLikeDislike as cAddLikeDislike } from "./comment";


export const addLikeDislikePost = (user, post, likeStatus) => {
    return (dispatch, state) => {
        dispatch(uAddLikeDislikePost({user : user._id, post : post._id, likeStatus : likeStatus}));
        dispatch(pAddLikeDislike({user : user._id, post : post._id, likeStatus : likeStatus}));
    }
}

export const addLikeDislikeComment = (user, comment, likeStatus) => {
    return (dispatch, state) => {
        dispatch(uAddLikeDislikeComment({user : user._id, comment : comment._id, likeStatus : likeStatus}));
        dispatch(cAddLikeDislike({user : user._id, comment : comment._id, likeStatus : likeStatus}));
    }
}

export const PostInfo = (postId) => {
    // What need? status, Author name, id, pfp if add
    // Post title, image, 
    return useSelector(state => state.posts.current.userId);
}

export const CommentInfo = (commentId) => {

}

export const UserInfo = (postId) => {

}