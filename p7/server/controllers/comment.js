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

    let newCommentObject = (await newComment.save())['_doc'];

    res.status(201).json({...newCommentObject});
}

exports.postComment = postComment;

async function getCommentsPost(req, res, next) {
    let commentsList = await Comment.find({'postParent' : req.params['postId']}).exec()
    return res.status(200).json({comments : commentsList});
}

exports.getCommentsPost = getCommentsPost;

exports.updateComment = async (req, res, next) => {
    let comment = (await Comment.findOne({_id : req.params['id']}))["_doc"]
    let newComment = {...comment, ...req.body};
    await Comment.updateOne({_id : req.params['id']}, newComment);

    return res.status(200).json({...newComment});
}

exports.deleteComment = async (req, res, next) => {
    let comment = {
        _id : req.params['id'],
        author : '[deleted]',
        content : '[comment deleted]',
        likes : -1,
        dislikes : -1,
        usersLiked : [],
        usersDisliked : [],
    }

    await Comment.updateOne({_id : req.params['id']}, comment);

    return res.status(200).json({...comment});
}

exports.addLikeDislike = async (req, res, next) => {
    let comment = (await Comment.findOne({_id : req.params['id']}))['_doc']
    const userId = req.body.userId;

    let tempIndex;

    switch (req.body.likeStatus) {
        case 1:
            if ((tempIndex = comment.usersLiked.indexOf(userId)) != -1) {
                comment.usersLiked.splice(tempIndex, 1);
            }
            else {
                if ((tempIndex = comment.usersDisliked.indexOf(userId)) != -1) {
                    comment.usersDisliked.splice(tempIndex, 1);
                }
                comment.usersLiked.push(userId);
            }
            break;
        case -1:
            if ((tempIndex = comment.usersDisliked.indexOf(userId)) != -1) {
                comment.usersDisliked.splice(tempIndex, 1);
            }
            else {
                if ((tempIndex = comment.usersLiked.indexOf(userId)) != -1) {
                    comment.usersLiked.splice(tempIndex, 1);
                }
                comment.usersDisliked.push(userId);
            }
            break;
    }
    comment.likes = comment.usersLiked.length;
    comment.dislikes = comment.usersDisliked.length;

    await Comment.updateOne({_id : req.params['id']}, comment);

    return res.status(200).json({...comment})
}