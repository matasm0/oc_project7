import { addLikeDislikePost as uAddLikeDislikePost } from "./user";
import { addLikeDislike as pAddLikeDislike } from "./post";

export const addLikeDislikePost = (user, post, likeStatus) => {
    return (dispatch, state) => {
        dispatch(uAddLikeDislikePost({user : user._id, post : post._id, likeStatus : likeStatus}));
        dispatch(pAddLikeDislike({user : user._id, post : post._id, likeStatus : likeStatus}));
    }
}