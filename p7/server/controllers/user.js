const { exec } = require('child_process');
const { isAsyncFunction } = require('util/types');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // check validity?
    if (!email || !password) {
        res.status(400).json({error : "Invalid signup request"});
        return;
    }

    let tempRes = {}
    try {
        tempRes = await User.findOne({email : email});
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    

    if (!tempRes) {
        return res.status(400).json({error : "Invalid username/password"});
    }
    const user = tempRes['_doc']  
    bcrypt.compare(password, user.password).then((valid) => {
        if (valid) {
            const token = jwt.sign(
                {userId : user._id},
                'RANDOM_TOKEN_SECRET',
                {expiresIn : '24h'}
            )

            // We don't need __v, and we don't want to send the password
            delete user['__v'];
            delete user['password'];

            res.status(200).json({
                ...user,
                token : token,
            });
        }
        else 
            res.status(400).json({message : "Invalid username/password"});
    });
}

exports.login = (req, res, next) => login(req, res, next);

async function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // check validity?
    if (!email || !password) {
        res.status(400).json({error : ("Invalid signup request")});
        return;
    }

    try {
        if (await User.findOne({email : email})) {
            res.status(400).json({error : "User already exists"});
        }
        else {
            // FIX
            bcrypt.hash(password, 10).then((hashedPw) => {
                const user = new User({
                    email : email,
                    password : hashedPw
                })
                user.save().then(() => {
                    res.status(200).json({message : "User created"});
                }).catch(e => {
                    res.status(400).json({error : "Failed to create user"});
                })
            })    
        }
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
}

exports.signup = (req, res, next) => signup(req, res, next);

exports.getUsers = async (req, res, next) => {
    let usersList = {}; 
    
    try{
        usersList = await User.find().exec();
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    let toReturn = []
    usersList.forEach(user => {
        user = user['_doc']
        delete user['__v']
        delete user['password']
        toReturn.push({...user});
    });
    return res.status(200).json({usersList : toReturn});
}

exports.getUserId = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    delete user['__v']
    delete user['password']

    return res.status(200).json({...user});
}

// Combine post and comment into one, just check which in here
exports.addLikeDislikePost = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    const postId = req.body.postId;

    let tempIndex;

    switch (req.body.likeStatus) {
        case 1:
            // User already liked, unlike
            if ((tempIndex = user.likedPosts.indexOf(postId)) != -1) {
                user.likedPosts.splice(tempIndex, 1);
            }
            // Like
            else {
                // User disliked, undo and like
                if ((tempIndex = user.dislikedPosts.indexOf(postId)) != -1) {
                    user.dislikedPosts.splice(tempIndex, 1);
                }
                user.likedPosts.push(postId);
            }
            break;
        case -1:
            // User already dislikes, undislike
            if ((tempIndex = user.dislikedPosts.indexOf(postId)) != -1) {
                user.dislikedPosts.splice(tempIndex, 1);
            }
            // Dislike
            else {
                // User liked, undo and dislike
                if ((tempIndex = user.likedPosts.indexOf(postId)) != -1) {
                    user.likedPosts.splice(tempIndex, 1);
                }
                user.dislikedPosts.push(postId);
            }
            break;
    }

    try {
        await User.updateOne({_id : req.params['id']}, user);
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }


    delete user['__v'];
    delete user['password'];

    return res.status(200).json({...user});
}

exports.addLikeDislikeComment = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    const commentId = req.body.commentId;

    let tempIndex;

    switch (req.body.likeStatus) {
        case 1:
            // User already liked, unlike
            if ((tempIndex = user.likedComments.indexOf(commentId)) != -1) {
                user.likedComments.splice(tempIndex, 1);
            }
            // Like
            else {
                // User disliked, undo and like
                if ((tempIndex = user.dislikedComments.indexOf(commentId)) != -1) {
                    user.dislikedComments.splice(tempIndex, 1);
                }
                user.likedComments.push(commentId);
            }
            break;
        case -1:
            // User already dislikes, undislike
            if ((tempIndex = user.dislikedComments.indexOf(commentId)) != -1) {
                user.dislikedComments.splice(tempIndex, 1);
            }
            // Dislike
            else {
                // User liked, undo and dislike
                if ((tempIndex = user.likedComments.indexOf(commentId)) != -1) {
                    user.likedComments.splice(tempIndex, 1);
                }
                user.dislikedComments.push(commentId);
            }
            break;
    }

    try {
        await User.updateOne({_id : req.params['id']}, user);
    }
    catch(e) {
        res.status(400).json({error : "Server access failed"});
    }

    delete user['__v'];
    delete user['password'];

    return res.status(200).json({...user});
}

exports.createPost = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    const postId = req.body.postId;

    user.posts.push(postId);

    await User.updateOne({_id : req.params['id']}, user);

    delete user['__v'];
    delete user['password'];

    return res.status(200).json({...user});
}

exports.createComment = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    const commentId = req.body.commentId;

    user.comments.push(commentId);

    await User.updateOne({_id : req.params['id']}, user);

    delete user['__v'];
    delete user['password'];

    return res.status(200).json({...user});
}

exports.deletePost = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    const postId = req.body.postId;

    const tempIndex = user.posts.indexOf(postId);
    user.posts.splice(tempIndex, 1);

    await User.updateOne({_id : req.params['id']}, user);

    delete user['__v'];
    delete user['password'];

    return res.status(200).json({...user});
}

exports.deleteComment = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    const commentId = req.body.commentId;

    const tempIndex = user.comments.indexOf(commentId);
    user.comments.splice(tempIndex, 1);

    await User.updateOne({_id : req.params['id']}, user);

    delete user['__v'];
    delete user['password'];

    return res.status(200).json({...user});
}

exports.readPost = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    const postId = req.body.postId;

    if (user.readPosts.indexOf(postId) == -1) {
        user.readPosts.push(postId);
    }

    await User.updateOne({_id : req.params['id']}, user);

    delete user['__v'];
    delete user['password'];

    return res.status(200).json({...user});
}

exports.updateUser = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    if (req.file) user['pfp'] = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    if (req.body.username) user['username'] = req.body.username;

    await User.updateOne({_id : req.params['id']}, user);

    delete user['__v'];
    delete user['password'];

    return res.status(200).json({...user});

}

exports.deleteUser = async (req, res, next) => {
    let user = {}
    try {
        user = (await User.findOne({_id : req.params['id']}))['_doc'];
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    user.username = '[deleted]';
    user.email = '[deleted]';
    user.password = "";
    user.likedPosts = user.dislikedPosts = user.likedComments = user.dislikedComments 
                    = user.comments = user.posts = user.readPosts = [];
    user.pfp = "";

    await User.updateOne({_id : req.params['id']}, user);

    return res.status(200).json({message : "Deleted"});
}