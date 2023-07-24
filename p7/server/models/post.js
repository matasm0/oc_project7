// const mongoose = require('mongoose');
// require('../client');

// const postSchema = mongoose.Schema({
//     userId : {type : String, required : true},
//     title : {type : String, required : true},
//     imageUrl : {type : String, required : true},
//     likes : {type : Number, required : true},
//     dislikes : {type : Number, required : true},
//     usersLiked : {type : [String], required : false},
//     usersDisliked : {type : [String], required : false},
//     comments : {type : [String], required : true},
//     created : {type : Number, required : true},
// });

// module.exports = mongoose.model("Post", postSchema, collection = "posts");
const dbPromise = require("../connect");

const postSchema = 
`
userId,
title,
imageUrl,
likes,
dislikes,
usersLiked,
usersDisliked,
comments,
created
`;

const qs = `(?,?,?,?,?,?,?,?,?)`;

const sql = `CREATE TABLE IF NOT EXISTS Posts (id INTEGER PRIMARY KEY, ${postSchema})`;

const init = async () => {
    const db = await dbPromise;
    db.run(sql, err => {
        console.error(err.message)
    });
    // db.run("DELETE FROM Posts WHERE id=2");
    // db.run(`DROP TABLE Posts`);
}

module.exports = init();