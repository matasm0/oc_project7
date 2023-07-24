// const Post = require('../models/post');
require('../models/post');
const dbPromise = require('../connect');

async function postPost(req, res, next) {
    const db = await dbPromise;
    
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    let newPost = {
        userId : "",
        title : "",
        imageUrl : "",
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked : [],
        comments : [],
        created : -1,
    };
    req.body.created = Number(req.body.created);
    req.body.userId = Number(req.body.userId);
    newPost = {...newPost, ...req.body, imageUrl};

    const cols = Object.keys(newPost).join(", ");
    const qs = Object.keys(newPost).fill("?").join(", ");
    const values = Object.values(newPost).map(obj => (typeof obj == "object") ? JSON.stringify(obj) : obj);
    
    try {
        const data = await db.run(`INSERT INTO Posts (${cols}) VALUES (${qs})`, values);
        const toReturn = (await db.all(`SELECT * FROM Posts WHERE id=${data['lastID']}`))[0]
        for (let prop in toReturn)
            if (toReturn[prop][0] == '[') toReturn[prop] = JSON.parse(toReturn[prop]);
        return res.status(201).json({message : "Post created", post : toReturn});
    }
    catch(e) {
        return res.status(400).json({error : e.message})
    }
}

exports.postPost = postPost;

async function getPosts(req, res, next) {
    const db = await dbPromise;

    let postsList = []; 
    
    try{
        postsList = await db.all(`SELECT * FROM Posts`);
    }
    catch(e) {
        return res.status(400).json({error : "Server access failed"});
    }

    const toReturn = []
    postsList.forEach(post => {
        for (let prop in post)
            if (post[prop][0] == '[') post[prop] = JSON.parse(post[prop]);
        toReturn.push({...post});
    });

    return res.status(200).json({posts : toReturn});
}

exports.getPosts = getPosts;

exports.getPostId = async (req, res, next) => {
    const db = await dbPromise;

    let post = {}
    try {post = (await db.all(`SELECT * FROM Posts WHERE id=${req.params['id']}`))[0]}
    catch(e) {return res.status(400).json({error : "Failed to get post"})}

    for (let prop in post)
        if (post[prop][0] == '[') post[prop] = JSON.parse(post[prop]);

    return res.status(200).json({post : post});
}

exports.deletePost = async (req, res, next) => {
    const db = await dbPromise;

    let post = {
        userId : "deleted",
        title : "deleted",
        likes : -1,
        dislikes : -1,
        imageUrl : ""
        // Do we need to clear likedUsers and such?
    }
    try {
        const toSet = [];
        for (let prop in post) {
            if (prop != "likes" && prop != "dislikes") post[prop] =  `'${post[prop]}'`
            toSet.push(`${prop} = ${post[prop]}`);
        }
        await db.run(`UPDATE Posts SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
        return res.status(200).json({message : "Post deleted"});
    }
    catch(e) {return res.status(400).json({error : "Failed to delete post"});}
}

exports.addLikeDislike = async (req, res, next) => {
    const db = await dbPromise;

    let post = {}
    try {post = (await db.all(`SELECT * FROM Posts WHERE id=${req.params['id']}`))[0]}
    catch(e) {return res.status(400).json({error : "Failed to like/dislike post"});}
    for (let prop in post)
            if (post[prop][0] == '[') post[prop] = JSON.parse(post[prop]);

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

    try {
        const toSet = [];
        toSet.push(`usersLiked = '${JSON.stringify(post.usersLiked)}'`);
        toSet.push(`usersDisliked = '${JSON.stringify(post.usersDisliked)}'`);
        toSet.push(`likes = ${post.likes}`);
        toSet.push(`dislikes = ${post.dislikes}`);
        await db.run(`UPDATE Posts SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        console.log(e.message);
        return res.status(400).json({error : "Failed to update post"});
    }

    return res.status(200).json({...post})
}