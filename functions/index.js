const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User')

module.exports.addMessage = async (message, userId, roomId) => {
    if(!message || !userId || !roomId){
        return{
            status:false,
            message:"Missing data"
        }
    }
    else{
        const msg = new Message({
            message: message,
            user: userId
        })
        msg.save();

        Room.findOne({_id:roomId})
        .then(room => {
            console.log(room)
            room.messages = [...room.messages,msg];
            room.save();
            return{
                status: true,
                room,
            }
        })
        .catch(err => {
            return{
                status: false,
                message: 'Error' + err,
            }
        })
    }
}