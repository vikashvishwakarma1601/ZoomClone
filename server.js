const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const roomID = require('./Model/RoomID')
const joinRoom = require('./controllers/JoinRoom')
const createRoom = require('./controllers/CreateRoom')
const peerServer = ExpressPeerServer(server, {
    debug: true
});


mongoose.connect('mongodb+srv://tonystark:UeqtwlMGscMqMo5L@cluster0.4a9oc.mongodb.net/MeetingApp?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))


app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors());
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.render('CreateAndJoin')
})



app.post('/create-room',async (req, res) => {
    let inputRoomID = req.body.RoomID
    let NewRoom = await createRoom(inputRoomID)
    if (NewRoom) {
        req.app.set('UserName', req.body.UserName)
        res.json({ Username: req.body.UserName, RoomID: NewRoom._id, status: true })
    }
    else {
        res.status(404).json({ Error: "Room ID Already Exists", status: false });
    }
})

app.post('/join-room', async (req, res) => {
    let inputRoomID = req.body.RoomID
    const RoomID = await joinRoom(inputRoomID);

    if (RoomID[0]) {
        req.app.set('UserName', req.body.UserName)
        res.json({ Username: req.body.UserName, RoomID: RoomID[0]._id, status: true })
    }
    else {
        res.status(400).json({ Error: "Room ID Not Found", status: false })
    }
})



app.get('/:roomID', (req, res) => {
    res.render('room', { roomID: req.params.roomID, UserName: req.app.get('UserName') })
})


let RoomUsers = {}
let Messages = {}
io.on('connection', (socket) => {
    socket.on('join-room', (RoomID, userID, UserName) => {
        socket.join(RoomID)
        if (RoomID in RoomUsers) {
            RoomUsers[RoomID].push([UserName, userID])
        }
        else {
            RoomUsers[RoomID] = [[UserName, userID]]
        }


        socket.to(RoomID).broadcast.emit("user-connected", userID, UserName, RoomUsers[RoomID])

        socket.on('message', (message, UserName) => {
            if (RoomID in Messages) {
                Messages[RoomID].push([UserName, message])
            }
            else {
                Messages[RoomID] = [[UserName, message]]
            }
            io.to(RoomID).emit('createMessage', message, UserName, Messages[RoomID])
        })

        socket.on('disconnect', () => {
            RoomUsers[RoomID] = RoomUsers[RoomID].filter((Users) => {
                if (Users[1] != userID) {
                    return Users
                }
            })
            socket.to(RoomID).broadcast.emit('user-disconnected', userID)
        })
    })
})

server.listen(8080);
