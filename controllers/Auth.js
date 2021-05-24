const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User')

const LOGIN = async (req, res) => {
    //Acquiring email and passwords from body
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body)
    // const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
    console.log('login hit')

    if(!username || !password){
        console.log('no credentials')
        res.send({
            status:false,
            message:"Missing credentials"
        })
    }
    else{
        User.findOne({username: username}, async (err, user) => {
            if(user){
                const isEqual = await bcrypt.compare(password, user.password);
                if (!isEqual) {
                    //Incorrect Password
                    console.log("Incorrect Password");
                    res.send({
                        status :false,
                        message :"Incorrect Password",
                    })
                }
                let token = jwt.sign({email: user.email}, process.env.TOKEN_SECRET,{ expiresIn: "1h" });
                res.send({
                    status: true,
                    token,
                    user
                })
            }
            else{
                console.log('User not found')
                res.send({
                    status:false,
                    message:'User not found'
                })
            }
            
        })
    }
}


const REGISTER = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.body)
    // const ip = req.header("x-forwarded-for") || req.connection.remoteAddress;
    console.log('register hit')

    if(!username || !password){
        console.log('no credentials')
        res.send({
            status:false,
            message:"Missing credentials"
        })
    }
    else{
        User.findOne({username: username}, async (err, user) => {
            if(!user){
                const hashedPassword = await bcrypt.hash(password, 12);
                var newUser =new User({
                    username: username,
                    password: hashedPassword,
                });
                newUser.save();
                let token = jwt.sign({username: newUser.username}, process.env.TOKEN_SECRET,{ expiresIn: "1h" });
                res.send({
                    status: true,
                    token,
                    user:newUser
                })
            }
            else{
                console.log('Username is taken')
                res.send({
                    status:false,
                    message:'Username is taken'
                })
            }
            
        })
    }
}

module.exports = {
    LOGIN,
    REGISTER,
};