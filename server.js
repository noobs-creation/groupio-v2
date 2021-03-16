const express = require('express')
const app = express()
const path = require('path')
const server = require('http').Server(app)
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/peerjs', peerServer);

const { v4: uuidV4 } = require('uuid')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const links = [];

app.get('/', function(req, res){
  // res.render('landing');
  res.sendFile(path.join(__dirname, 'views/index.html'))
});

app.post('/existingRoom', function(req, res){
  var link = req.body.customLink;
  var flag = link.startsWith("https://group-io.herokuapp.com/");
  if(flag){
    var newLink = link.replace("https://group-io.herokuapp.com/", "");
  }else{
    var newLink = link;
  }
  res.redirect('/'+newLink);
});

app.get('/:room', function(req, res){
 // console.log(links)
 var roomId = req.params.room;
 res.render('room', {roomId: roomId})
});

app.post('/newRoom', function(req, res){
   res.redirect(`/${uuidV4()}`);
});





//will run anytime anyone connects
//
io.on('connection', socket => {
  //listening to event when someone joins room
  //sends userid and roomid

  socket.on('join-room', (roomId, userId) => {
    //joining room
    socket.join(roomId)
    //sending message to room
    //broadcast sends message to everyone else in the room except me
    //another event and passing userid
    socket.to(roomId).broadcast.emit('user-connected', userId)
    //this will get called when someone leaves or disconnects

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

//starts server on port 3000
server.listen(process.env.PORT||3300) 