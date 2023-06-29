const Post = require('../models/post');

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

    console.log(imageUrl);
    console.log(req.body);

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
    let postList = await Post.find().exec();

    return res.status(200).json({posts : postList});
}

exports.getPosts = getPosts;

exports.getPostId = async (req, res, next) => {
    const post = await Post.find({_id : req.params['id']}).exec();
    return res.status(200).json({post : post[0]});
}