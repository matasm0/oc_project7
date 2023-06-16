const { exec } = require('child_process');
const { isAsyncFunction } = require('util/types');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // check validity?
    if (!email || !password) {
        res.status(400).send(new Error("Invalid signup request"));
        return;
    }

    const user = await User.findOne({email : email});
    
    if (!user) {
        res.status(400).json({message : "Invalid username/password"});
    }
    else {   
        bcrypt.compare(password, user.password).then((valid) => {
            if (valid) {
                const token = jwt.sign(
                    {userId : user._id},
                    'RANDOM_TOKEN_SECRET',
                    {expiresIn : '24h'}
                )
                res.status(200).json({
                    userId : user._id,
                    token : token
                });
            }
            else 
                res.status(400).json({message : "Invalid username/password"});
        });
    }
}

exports.login = (req, res, next) => login(req, res, next);

async function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // check validity?
    if (!email || !password) {
        res.status(400).json({message : ("Invalid signup request")});
        return;
    }

    if (await User.findOne({email : email})) {
        res.status(400).json({message : "User already exists"});
    }
    else {
        bcrypt.hash(password, 10).then((hashedPw) => {
            const user = new User({
                email : email,
                password : hashedPw
            })
            user.save().then(() => {
                res.status(200).json({message : "User created"});
            }).catch(e => {
                res.status(400).json({message : "Failed to create user"});
            })
        })    
    }
}

exports.signup = (req, res, next) => signup(req, res, next);