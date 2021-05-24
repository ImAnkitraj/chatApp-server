const http = require('http');
require("dotenv").config()
const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyparser = require('body-parser');
// const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const { addMessage } = require('./functions');
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

mongoose.connect("mongodb+srv://ankit:passraj@aimusic-es8pe.mongodb.net/aichat?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true  })
.then(()=>console.log('connected'))
.catch(e=>console.log(e))
// mongoose.connect("mongodb://localhost/aichat",{ useNewUrlParser: true,useUnifiedTopology: true  });
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(require('./routes/index'));
app.use(require('./routes/Auth'));

io.on('connect', (socket) => {

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

    socket.on('disconnect', () => {
        console.log('disconnect')
    })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));