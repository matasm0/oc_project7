// const mongoose = require("mongoose");
// require('../client');

// const commentSchema = mongoose.Schema({
//     author : {type : String, required : true},
//     content : {type : String, required : true},
//     likes : {type : Number, required : true},
//     dislikes : {type : Number, required : true},
//     usersLiked : {type : [String], required : false},
//     usersDisliked : {type : [String], required : false},
//     parent : {type : String, required : true},
//     postParent : {type : String, required : true},
//     children : {type : [String], required : true},
//     created : {type : Number, required : true},
// })

// module.exports = mongoose.model("Comment", commentSchema, collection="comments")
const dbPromise = require('../connect');

const commentSchema = 
`
author,
content,
likes,
dislikes,
usersLiked,
usersDisliked,
parent,
postParent,
children,
created
`;

const qs = `(?,?,?,?,?,?,?,?,?,?)`;

const sql = `CREATE TABLE IF NOT EXISTS Comments (id INTEGER PRIMARY KEY, ${commentSchema})`;

const init = async () => {
    const db = await dbPromise;
    db.run(sql, err => {
        console.error(err.message)
    });
}

module.exports = init();