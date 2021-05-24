var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   firstname:String,
   lastname: String,
   email:String,
   friends:[{
         roomId :{
            type: mongoose.Schema.Types.ObjectId,
         },
         friendId:{
            type: mongoose.Schema.Types.ObjectId,
         }
   }]
});
module.exports= mongoose.model("User", UserSchema);