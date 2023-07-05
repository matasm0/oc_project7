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
        res.status(400).send(new Error("Invalid signup request"));
        return;
    }

    const tempRes = await User.findOne({email : email});
    const user = tempRes['_doc']

    if (!user) {
        res.status(400).json({message : "Invalid username/password"});
    }
    else {   
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
}

exports.login = (req, res, next) => login(req, res, next);

async function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // check validity?
    if (!email || !password) {
        res.status(400).json({message : ("Invalid signup request")});
        return;
    }

    if (await User.findOne({email : email})) {
        res.status(400).json({message : "User already exists"});
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
                res.status(400).json({message : "Failed to create user"});
            })
        })    
    }
}

exports.signup = (req, res, next) => signup(req, res, next);

exports.getUsers = async (req, res, next) => {
    let usersList = await User.find().exec();
    let toReturn = []
    usersList.forEach(user => {
        // We need to add usernames and pfps, liked/dislike list
        toReturn.push({'_id' : user._id, 'email' : user.email, 'posts' : user.posts, 'comments' : user.comments,})
    });
    return res.status(200).json({usersList : toReturn});
}


exports.addLikeDislikePost = async (req, res, next) => {
    let user = (await User.findOne({_id : req.params['id']}))['_doc'];
    const postId = req.body.postId;

    delete user['__v'];
    delete user['password'];
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

    await User.updateOne({_id : req.params['id']}, user);

    return res.status(200).json({...user})
}