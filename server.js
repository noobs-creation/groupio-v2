const express = require('express')
const app = express()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);

const { v4: uuidV4 } = require('uuid')

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const links = [];

// for dynamic url we are using uuid
// const { v4: uuidV4 } = require('uuid')

// //setting express server
// //rendering views 
// app.set('view engine', 'ejs')
// //all js and css will be stored in public
// app.use(express.static('public'))

// //going to homepage creates a brand new room
// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`)
// })

// // :room dynamic var
// //req.params.room gets value from url
// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room })
// })



app.get('/', function(req, res){
  res.render('landing');
});

app.post('/existingRoom', function(req, res){
  var link = req.body.customLink;
  res.redirect('/'+link);
});

app.get('/:room', function(req, res){
 // console.log(links)
 var roomId = req.params.room;
 res.render('room', {roomId: roomId})
});

app.post('/existingRoom', function(req, res){
   var link = req.body.customLink;
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
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

//starts server on port 3000
server.listen(process.env.PORT||3300) 