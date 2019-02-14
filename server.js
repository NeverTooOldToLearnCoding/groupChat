var session = require('express-session');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');

const server = app.listen(8000, function() {
  console.log("listening on port 8000");
})

const io = require('socket.io')(server);

var color;

app.use(session({
  secret: 'kingKrool',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

// var person = [];
var message = "";
var sessionID;

// this is the line that tells our server to use the "/static" folder for static content
app.use(express.static(__dirname + "/static"));
// two underscores before dirname

// This sets the location where express will look for the ejs views
app.set('views', __dirname + '/views'); 
// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('view engine', 'ejs');


io.on('connection', function (socket) { 

    socket.on("message",function(data){

      message = message + data.data;

      console.log("Message received from client: " + message);

      io.emit("messageToAll", message);

    });

    socket.on("got_a_new_user",function(name){

      message += "<p>"+ name.data + " has joined the chatroom.</p>";

      io.emit('new_user',message);

    });
  });

app.get("/", function (request, response){

    response.render('index');
})