// const mongoose = require('mongoose');
// require('../client');

// const userSchema = mongoose.Schema({
//     email : {type : String, required : true},
//     password : {type : String, required : true},
//     likedPosts : {type : [String], required : true},
//     dislikedPosts : {type : [String], required : true},
//     posts : {type : [String], required : true},
//     comments : {type : [String], required : true},
//     likedComments : {type : [String], required : true},
//     dislikedComments : {type : [String], required : true},
//     readPosts : {type : [String], required : true},
//     username : {type : String, required : true},
//     pfp : {type : String, required : false}
// })

// module.exports = mongoose.model("User", userSchema, collection = "users");
const dbPromise = require("../connect");

const userSchema = `email,
                    password,
                    likedPosts,
                    dislikedPosts,
                    posts,
                    comments,
                    likedComments,
                    dislikedComments,
                    readPosts,
                    username,
                    pfp`

const userQs = `(?,?,?,?,?,?,?,?,?,?,?)`

const sql = `CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, ${userSchema})`;

const init = async () => {
    const db = await dbPromise;
    db.run(sql, err => {
        console.error(err.message)
    });
    // db.run(`INSERT INTO Users (${userSchema}) VALUES ${userQs}`, ["a@a.a", "a", JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), JSON.stringify([]), "a@a.a", ""])
    // const thingies = await db.all(`SELECT * FROM Users`);
    // console.log(thingies);
    // db.run("DELETE FROM Users WHERE id=1");
}

module.exports = init();