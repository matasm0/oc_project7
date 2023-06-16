const Post = require('../models/post');

const postDefault = {
    userId :  "-1",
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked : [],
    imageUrl : "a"
}

async function postPost(req, res, next) {
    let newPost;

    try {
        newPost = new Post({...postDefault, ...req.body});
    }
    catch (e) {
        return res.status(401).json({message : "Failed to create post", e})
    }

    await newPost.save();

    res.status(201).json({message : "Created"})
}

exports.postPost = postPost;