const express  = require("express");
const app = express();
const ejs = require("ejs");

const bodyParser = require("body-parser");

const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const server = require('http').Server(app)
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

// const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

// app.set('view engine', 'ejs')
app.use(express.static('public'))





const links = [];


app.get('/', function(req, res){
   res.render('landing');
});

app.get('/:room', function(req, res){
  // console.log(links)
  var roomId = req.params.room;

  res.render('room', {roomId: roomId})
});

app.post('/submitForm', function(req, res){
    var link = req.body.customLink;
    res.redirect('/'+link);
});


io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

// app.listen(port, function (){
//   console.log("Server running");
// });

server.listen(process.env.PORT||3030)