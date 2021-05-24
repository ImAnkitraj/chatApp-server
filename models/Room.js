var mongoose = require("mongoose");
var RoomSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]
});
module.exports= mongoose.model("Room", RoomSchema);