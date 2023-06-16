const mongoose = require('mongoose');
require('../client');

const userSchema = mongoose.Schema({
    email : {type : String, required : true},
    password : {type : String, required : true}
})

module.exports = mongoose.model("User", userSchema, collection = "users");