const mongoose = require("mongoose");
require('../client');

const commentSchema = mongoose.Schema({
    author : {type : String, required : true},
    content : {type : String, required : true},
    likes : {type : Number, required : true},
    dislikes : {type : Number, required : true},
    usersLiked : {type : [String], required : false},
    usersDisliked : {type : [String], required : false},
    parent : {type : String, required : true},
    postParent : {type : String, required : true},
    children : {type : [String], required : true},
})

module.exports = mongoose.model("Comment", commentSchema, collection="comments")