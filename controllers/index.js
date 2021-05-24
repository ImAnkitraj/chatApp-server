const { addMessage } = require('../functions');
const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User')
var FuzzySearch = require('fuzzy-search')

module.exports.GET_USER = (req,res) => {
    const id = req.params.id;
    User.findById(id, (err, user)=>{
        if(err){
            res.send({
                status:false,
                message:"Database error",
            })
        }
        else{
            if(user){
                res.send({
                    status:true,
                    user:user,
                })
            }
            else{
                res.send({
                    status:false,
                    message:"User not found",
                })
            }
        }
    })
}

module.exports.ADD_FRIEND = (req, res) => {

    const userId = req.body.userId;
    const friendId = req.body.friendId;

    if(!userId || !friendId){
        res.send({
            status:false,
            message:'Missing data',
        })
    }
    else{
        const room = new Room({
            users:[userId,friendId],
        });
        room.save();


        let error = false;
        User.findOne({_id:userId})
        .then((user)=>{
            user.friends = [...user.friends,{roomId: room._id, friendId: friendId}];
            user.save();
        })
        .catch((err)=>{
            error=true;
        })

        User.findOne({_id:friendId})
        .then((user)=>{
            user.friends = [...user.friends,{roomId: room._id, friendId: userId}];
            user.save();
        })
        .catch((err)=>{
            error=true
        })

        if(error){
            res.send({
                status:false,
                message:"Databse error",
            })
        }
        else{
            res.send({
                status:true,
                room:room
            })
        }
    }
}

module.exports.GET_FRIENDS = (req, res) => {
    const id = req.params.id;
    User.findOne({_id:id})
    .populate('friends')
    .exec((err, user)=>{
        if(err){
            res.send({
                status:false,
                message:'Database error'
            })
        }
        else{
            let friends = [];
            user.friends.map((_)=>{
                friends.push(_.friendId)
            })

            User.find({_id: {$in :[...friends]}})
            .then((friends)=>{
                res.send({
                    status:true,
                    friends:friends,
                })
            })
            .catch(err=>{
                res.send({
                    status:false,
                    message:"Databse error"
                })
            })
        }
    })
}

module.exports.GET_ROOM = (req, res) => {
    const roomId = req.params.id;
    Room.findOne({_id: roomId})
    .populate('messages')
    .exec((err, room)=>{
        if(err){
            res.send({
                status:false,
                message:'Databse error'
            })
        }
        else{
            res.send({
                status: true,
                room
            })
        }
    })
}

module.exports.SEARCH = async (req, res) => {
    console.log('search hit')
    const searchText = req.body.searchText
    var users = await User.find({});
    const searcher = new FuzzySearch(users, ['username', 'email', 'lastname', 'firstname'], {
        caseSensitive: false,
    });
    const result = searcher.search(searchText);
    res.send(result);
}