// const Comment = require('../models/comment');
require("../models/comment")
const dbPromise = require('../connect');

async function postComment(req, res, next) {
    const db = await dbPromise;

    let comment = {
        author : "",
        content : "",
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked : [],
        parent : -1,
        postParent : -1,
        children : [],
        created : -1
    }
    req.body.created = Number(req.body.created);
    req.body.author = Number(req.body.author);
    req.body.postParent = Number(req.body.postParent);
    if (req.body.parent != "root") req.body.parent = Number(req.body.parent);

    comment = {...comment, ...req.body};

    const cols = Object.keys(comment).join(", ");
    const qs = Object.keys(comment).fill("?").join(", ");
    const values = Object.values(comment).map(obj => (typeof obj == "object") ? JSON.stringify(obj) : obj);

    try {
        const data = await db.run(`INSERT INTO Comments (${cols}) VALUES (${qs})`, values)
        const toReturn = (await db.all(`SELECT * FROM Comments WHERE id=${data['lastID']}`))[0];
        for (let prop in toReturn)
            if (toReturn[prop][0] == '[') toReturn[prop] = JSON.parse(toReturn[prop]);
        return res.status(201).json({...toReturn});
    }
    catch (e) {
        return res.status(401).json({message : "Failed to add comment", e})
    }
}

exports.postComment = postComment;

async function getCommentsPost(req, res, next) {
    const db = await dbPromise;

    let commentsList = []

    try {
        commentsList = await db.all(`SELECT * FROM Comments WHERE postParent=${Number(req.params['postId'])}`)
    }
    catch(e) {return res.status(400).json({error : "Failed to get comments"})}

    const toReturn = [];
    commentsList.forEach(comment => {
        for (let prop in comment)
            if (comment[prop][0] == '[') comment[prop] = JSON.parse(comment[prop]);
        toReturn.push({...comment})
    })

    return res.status(200).json({comments : toReturn});
}

exports.getCommentsPost = getCommentsPost;

exports.getComments = async (req, res, next) => {
    const db = await dbPromise;

    let commentsList = []

    try {
        commentsList = await db.all(`SELECT * FROM Comments`)
    }
    catch(e) {return res.status(400).json({error : "Failed to get comments"})}

    const toReturn = [];
    commentsList.forEach(comment => {
        for (let prop in comment)
            if (comment[prop][0] == '[') comment[prop] = JSON.parse(comment[prop]);
        toReturn.push({...comment})
    })

    return res.status(200).json({comments : toReturn});
}

// // Have a get comments Id or something that also returns the parent and the child comment

exports.updateComment = async (req, res, next) => {
    const db = await dbPromise;

    await db.run(`UPDATE Comments SET content=? WHERE id=?`, req.body.content, req.params['id']);

    const comment = (await db.all(`SELECT * FROM Comments WHERE id=${req.params['id']}`))[0];
    for (let prop in comment)
        if (comment[prop][0] == '[') comment[prop] = JSON.parse(comment[prop]);

    return res.status(200).json({...comment});
}

exports.deleteComment = async (req, res, next) => {
    const db = await dbPromise;

    let comment = {
        author : 'deleted',
        content : 'comment deleted',
        likes : -1,
        dislikes : -1,
    }

    try {
        const toSet = [];
        toReturn = {...comment}
        for (let prop in comment) {
            if (prop != "likes" && prop != "dislikes") comment[prop] = `'${comment[prop]}'`;
            toSet.push(`${prop} = ${comment[prop]}`);
        }
        await db.run(`UPDATE Comments SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
        return res.status(200).json({...toReturn});
    }
    catch(e) {return res.status(400).json({error : "Failed to delete comment"});}
}

exports.addLikeDislike = async (req, res, next) => {
    const db = await dbPromise;
    let comment = {}
    try {comment = (await db.all(`SELECT * FROM Comments WHERE id='${req.params['id']}'`))[0]}
    catch(e) {return res.status(400).json({error : "Failed to like/dislike comment"})}
    for (let prop in comment)
        if (comment[prop][0] == '[') comment[prop] = JSON.parse(comment[prop]);

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

    try {
        const toSet = [];
        toSet.push(`usersLiked = '${JSON.stringify(comment.usersLiked)}'`);
        toSet.push(`usersDisliked = '${JSON.stringify(comment.usersDisliked)}'`);
        toSet.push(`likes = ${comment.likes}`);
        toSet.push(`dislikes = ${comment.dislikes}`);
        await db.run(`UPDATE Comments SET ${toSet.join(", ")} WHERE id=?`, req.params['id']);
    }
    catch(e) {
        return res.status(400).json({error : "Failed to update comment"});
    }

    return res.status(200).json({...comment})
}