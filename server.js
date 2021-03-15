const express  = require("express");
const app = express();
const ejs = require("ejs");

const bodyParser = require("body-parser");
const http = require("http");
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



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

app.listen(port, function (){
  console.log("Server running");
});

