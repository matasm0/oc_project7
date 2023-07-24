// const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require("../models/user");
const dbPromise = require("../connect");

exports.login = async (req, res, next) => {
    const db = await dbPromise;

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.status(400).json({error : "Invalid signup request"});
        return;
    }

    let user = {}

    try {
        user = (await db.all(`SELECT * FROM Users WHERE email='${email}'`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    
    if (!user) {
        return res.status(400).json({error : "Invalid username/password"});
    }

    for (let prop in user) {
        user[prop] = user[prop][0] == '[' ? JSON.parse(user[prop]) : user[prop]
    }

    bcrypt.compare(password, user.password).then((valid) => {
        if (valid) {
            const token = jwt.sign(
                {userId : user.id},
                'RANDOM_TOKEN_SECRET',
                {expiresIn : '24h'}
            )

            delete user['password'];

            res.status(200).json({
                ...user,
                token : token,
            });
        }
        else 
            res.status(400).json({error : "Invalid username/password"});
    });
}

// Should probably sanitize inputs!
exports.signup = async (req, res, next) => {
    const db = await dbPromise;

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) return res.status(400).json({error : "Invalid signup request"});

    if ((await db.all(`SELECT * FROM Users WHERE email='${email}'`)).length != 0) {
        return res.status(400).json({error : "User already exists"});
    }
    else {
        bcrypt.hash(password, 10).then((hashedPw) => {
            let user = {
                email : "",
                password : "",
                likedPosts : [],
                dislikedPosts : [],
                posts : [],
                comments : [],
                likedComments : [],
                dislikedComments : [],
                readPosts : [],
                username : email,
                pfp : "",
            }
            user = {...user, email, password : hashedPw};
            const cols = Object.keys(user).join(", ");
            const qs = Object.keys(user).fill("?").join(", ");
            const values = Object.values(user).map(obj => (typeof obj === "object") ? JSON.stringify(obj) : obj);

            try {db.run(`INSERT INTO Users (${cols}) VALUES (${qs})`, values).then(() => {
                return res.status(201).json({message : "User created"});
            })}
            catch(e) {
                return res.status(400).json({error : e.message})
            }
        })
    }
}

exports.getUsers = async (req, res, next) => {
    const db = await dbPromise;

    let usersList = []; 
    
    try{
        usersList = await db.all(`SELECT * FROM Users`);
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    const toReturn = []
    usersList.forEach(user => {
        for (let prop in user)
            if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);
        delete user['password'];
        toReturn.push({...user});
    });

    return res.status(200).json({usersList : toReturn});
}

exports.getUserId = async (req, res, next) => {
    const db = await dbPromise;

    let user = {};
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    for (let prop in user)
        if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

    delete user['password']

    return res.status(200).json({...user});
}

exports.addLikeDislikePost = async (req, res, next) => {
    const db = await dbPromise;
    
    let user = {};
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    for (let prop in user)
        if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

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
        const toSet = []
        toSet.push(`likedPosts = '${JSON.stringify(user.likedPosts)}'`);
        toSet.push(`dislikedPosts = '${JSON.stringify(user.dislikedPosts)}'`);
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    delete user['password'];

    return res.status(200).json({...user});
}

exports.addLikeDislikeComment = async (req, res, next) => {
    const db = await dbPromise;

    let user = {}
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    for (let prop in user)
        if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

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
        const toSet = []
        toSet.push(`likedComments = '${JSON.stringify(user.likedComments)}'`);
        toSet.push(`dislikedComments = '${JSON.stringify(user.dislikedComments)}'`);
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        res.status(400).json({error : "Server access failed"});
    }

    delete user['password'];

    return res.status(200).json({...user});
}

exports.createPost = async (req, res, next) => {
    const db = await dbPromise;

    let user = {}
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    for (let prop in user)
        if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

    const postId = req.body.postId;

    user.posts.push(postId);

    try {
        const toSet = [];
        toSet.push(`posts = '${JSON.stringify(user.posts)}'`);
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        return res.status(400).json({error : e.message});
    }

    delete user['password'];

    return res.status(200).json({...user});
}

exports.createComment = async (req, res, next) => {
    const db = await dbPromise;
    let user = {}
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    for (let prop in user)
            if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

    const commentId = req.body.commentId;

    user.comments.push(commentId);

    try {
        const toSet = [];
        toSet.push(`comments = '${JSON.stringify(user.comments)}'`);
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        return res.status(400).json({error : e.message});
    }

    delete user['password'];

    return res.status(200).json({...user});
}

exports.deletePost = async (req, res, next) => {
    const db = await dbPromise;

    let user = {}
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    for (let prop in user)
            if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);
    
    const postId = req.body.postId;

    const tempIndex = user.posts.indexOf(postId);
    user.posts.splice(tempIndex, 1);

    try {
        const toSet = [];
        toSet.push(`posts = '${JSON.stringify(user.posts)}'`);
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        return res.status(400).json({error : e.message});
    }

    delete user['password'];

    return res.status(200).json({...user});
}

exports.deleteComment = async (req, res, next) => {
    const db = await dbPromise;

    let user = {}
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    for (let prop in user)
            if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

    const commentId = req.body.commentId;

    const tempIndex = user.comments.indexOf(commentId);
    user.comments.splice(tempIndex, 1);

    try {
        const toSet = [];
        toSet.push(`comments = '${JSON.stringify(user.comments)}'`);
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        return res.status(400).json({error : e.message});
    }

    delete user['password'];

    return res.status(200).json({...user});
}

exports.readPost = async (req, res, next) => {
    const db = await dbPromise;

    let user = {}
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    for (let prop in user)
        if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

    const postId = req.body.postId;

    if (user.readPosts.indexOf(postId) == -1) {
        user.readPosts.push(postId);
    }

    try {
        const toSet = [];
        toSet.push(`readPosts = '${JSON.stringify(user.readPosts)}'`);
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        return res.status(400).json({error : e.message});
    }

    delete user['password'];

    return res.status(200).json({...user});
}

exports.updateUser = async (req, res, next) => {
    const db = await dbPromise;

    let user = {}
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    for (let prop in user)
        if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

    if (req.file) user['pfp'] = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    if (req.body.username) user['username'] = req.body.username;

    const returnUser = {...user}

    try {
        const toSet = []
        for (let prop in user) {
            if (typeof user[prop] == "object") user[prop] = JSON.stringify(user[prop]);
            if (prop != 'id') user[prop] = `"${user[prop]}"`;
            toSet.push(`${prop} = ${user[prop]}`);
        }
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        console.log(e.message);
        return res.status(400).json({error : "Server access failed"});
    }

    delete returnUser['password'];

    return res.status(200).json({...returnUser});

}

exports.deleteUser = async (req, res, next) => {
    const db = await dbPromise;

    let user = {}
    try {
        user = (await db.all(`SELECT * FROM Users WHERE id=${req.params['id']}`))[0]
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }
    for (let prop in user)
        if (user[prop][0] == '[') user[prop] = JSON.parse(user[prop]);

    user.username = 'deleted';
    user.email = 'deleted';
    user.password = "";
    user.likedPosts = user.dislikedPosts = user.likedComments = user.dislikedComments 
                    = user.comments = user.posts = user.readPosts = [];
    user.pfp = "";

    try {
        const toSet = []
        for (let prop in user) {
            if (typeof user[prop] == "object") user[prop] = JSON.stringify(user[prop]);
            if (prop != 'id') user[prop] = `"${user[prop]}"`;
            toSet.push(`${prop} = ${user[prop]}`);
        }
        await db.run(`UPDATE Users SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        console.log(e.message);
        return res.status(400).json({error : "Server access failed"});
    }

    return res.status(200).json({message : "Deleted"});
}