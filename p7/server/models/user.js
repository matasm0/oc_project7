const mongoose = require('mongoose');
require('../client');

const userSchema = mongoose.Schema({
    email : {type : String, required : true},
    password : {type : String, required : true},
    likedPosts : {type : [String], required : true},
    dislikedPosts : {type : [String], required : true},
    posts : {type : [String], required : true},
    comments : {type : [String], required : true},
    likedComments : {type : [String], required : true},
    dislikedComments : {type : [String], required : true},
    readPosts : {type : [String], required : true},
    // friends, pfp, username
})

module.exports = mongoose.model("User", userSchema, collection = "users");