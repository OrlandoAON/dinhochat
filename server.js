var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var numUsers = 0;
server.listen(8080);

app.use("/", express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
	++numUsers;
	io.sockets.emit('serverInfo', "Welcome to Dinho's Chat");
	socket.on('msg', function (data) {
		io.sockets.emit('new', data);
	});
 //  socket.on('newUser', function (data) {
 //   io.sockets.emit('serverInfo', data);
//  });

	// when the client emits 'add user', this listens and executes
//  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
//    socket.username = username;
    // add the client's username to the global list
 //   usernames[username] = username;
 //   ++numUsers;
 //   addedUser = true;
 //   socket.emit('login', {
  //    numUsers: numUsers
  //  });
    // echo globally (all clients) that a person has connected
	socket.on('user joined', function(data) {
	 	socket.emit ('user joined',{
	  		username: socket.username,
	  		numUsers: numUsers
	  	});
	  	socket.broadcast.emit ('user joined',{
	  		username: socket.username,
	  		numUsers: numUsers
	  	});
	});

	io.sockets.on('disconnect', function (socket) {
	io.sockets.emit('serverInfo', "User Left");	
	--numUsers;
	});
//  });

});