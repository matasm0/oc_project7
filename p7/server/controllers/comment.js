const Comment = require('../models/comment');

const commentDefault = {
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked : [],
    children : [],
}

// Comments need : author, parent, postParent, content

async function postComment(req, res, next) {
    let newComment;

    try {
        newComment = new Comment({...commentDefault, ...req.body});
    }
    catch (e) {
        console.log(e)
        return res.status(401).json({message : "Failed to add comment", e})
    }

    let newCommentObject = await newComment.save();

    res.status(201).json({message : "Posted", comment : newCommentObject});
}

exports.postComment = postComment;

async function getCommentsPost(req, res, next) {
    let commentsList = await Comment.find({'postParent' : req.params['postId']}).exec()
    return res.status(200).json({comments : commentsList});
}

exports.getCommentsPost = getCommentsPost;