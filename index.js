const http = require('http');
require("dotenv").config()
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyparser = require('body-parser');
const { addMessage } = require('./functions');
const app = express();
app.use(cors());

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(require('./routes/index'));
app.use(require('./routes/Auth'));
const server = http.createServer(app);
const io = socketio(server,{
    cors:{
        origin:"*"
    }
});

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true  })
.then(()=>console.log('connected'))
.catch(e=>console.log(e))

// mongoose.connect("mongodb://localhost/aichat",{ useNewUrlParser: true,useUnifiedTopology: true  })
// .then(()=>console.log('connected'))
// .catch(e=>console.log(e))
// mongoose.connect("mongodb://localhost:27017/aichat?readPreference=primary&appname=MongoDB%20Compass&ssl=false",{ useNewUrlParser: true,useUnifiedTopology: true  })
// .then(()=>console.log('connected'))
// .catch(e=>console.log(e))

io.on('connection', (socket) => {
    socket.on('join',({roomId}, callback)=>{
        socket.join(roomId);
        callback();
    });

    socket.on('sendMessage',({message, userId, roomId}, callback)=>{
        io.to(roomId).emit('message',{message:message, user:userId})
        console.log({message, userId, roomId})
        callback();
        const data = addMessage(message, userId, roomId);
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));