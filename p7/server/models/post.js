const mongoose = require('mongoose');
require('../client');

const postSchema = mongoose.Schema({
    userId : {type : String, required : true},
    title : {type : String, required : true},
    imageUrl : {type : String, required : true},
    likes : {type : Number, required : true},
    dislikes : {type : Number, required : true},
    usersLiked : {type : [String], required : false},
    usersDisliked : {type : [String], required : false},
    comments : {type : [String], required : true}
});

module.exports = mongoose.model("Post", postSchema, collection = "posts");