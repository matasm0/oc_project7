const Post = require('../models/post');
const user = require('../models/user');

const postDefault = {
    userId :  "-1",
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked : [],
    imageUrl : "a",
    comments : []
}

async function postPost(req, res, next) {
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    let newPost;

    try {
        newPost = new Post({...postDefault, ...req.body, imageUrl});
    }
    catch (e) {
        return res.status(401).json({message : "Failed to create post", e})
    }

    let newPostObject = await newPost.save();

    res.status(201).json({message : "Created", post : newPostObject});
}

exports.postPost = postPost;

async function getPosts(req, res, next) {
    let postList = await Post.find({'userId' : {$ne : 'deleted'}}).exec();

    return res.status(200).json({posts : postList});
}

exports.getPosts = getPosts;

exports.getPostId = async (req, res, next) => {
    const post = await Post.find({_id : req.params['id']}).exec();
    return res.status(200).json({post : post[0]});
}

exports.deletePost = async (req, res, next) => {
    // Check userid
    // Post.deleteOne({_id : req.params['id']});
    let post = {...req.body, userId : "deleted", title : "deleted", likes : -1, dislikes : -1, imageUrl : ""}
    await Post.updateOne({_id : req.params['id']}, post);
    return res.status(200).json({message : "Post Deleted"});
}

exports.addLikeDislike = async (req, res, next) => {
    let post = (await Post.findOne({_id : req.params['id']}).exec())['_doc'];
    const userId = req.body.userId;

    let tempIndex;

    switch (req.body.likeStatus) {
        case 1:
            if ((tempIndex = post.usersLiked.indexOf(userId)) != -1) {
                post.usersLiked.splice(tempIndex, 1);
            }
            else {
                if ((tempIndex = post.usersDisliked.indexOf(userId)) != -1) {
                    post.usersDisliked.splice(tempIndex, 1);
                }
                post.usersLiked.push(userId);
            }
            break;
        case -1:
            if ((tempIndex = post.usersDisliked.indexOf(userId)) != -1) {
                post.usersDisliked.splice(tempIndex, 1);
            }
            else {
                if ((tempIndex = post.usersLiked.indexOf(userId)) != -1) {
                    post.usersLiked.splice(tempIndex, 1);
                }
                post.usersDisliked.push(userId);
            }
            break;
    }
    post.likes = post.usersLiked.length;
    post.dislikes = post.usersDisliked.length;

    await Post.updateOne({_id : req.params['id']}, post);

    return res.status(200).json({...post})
}