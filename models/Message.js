var mongoose = require("mongoose");
var MessageSchema = new mongoose.Schema({
    message: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    created_at: {
        type:Date,
        default: Date.now(),
        required: true
    },
});
module.exports= mongoose.model("Message", MessageSchema);