/*
 * app.js
 * 
 */

var config_file = (process.argv[2] || 'dev') + '_config.js'
  , config = require('./' + config_file)
  , http = require('./lib/http_handler.js')
  , app = require('http').createServer(http.handler) //we need an http server 
  , io = require('socket.io').listen(app) //socket.io, yay
  , fs = require('fs') //filesystem for file stuff
  , _ = require('underscore') //underscore.js utl lib
  , util = require('util') //some utilities
  , user_port = process.argv[3] || config.user_port || 8080
  , admin_pass = config.admin_pass
  ;

app.listen(user_port);

io.sockets.on('connection', function (socket) {
	
	  var client_log = function(e){
	  	console.log(["Sending to the user:", e]);
	  	try{
	  		if (e instanceof Error)
	  			e = e.stack + "";
	  		else
	  			e = e + "";
	  		console.log(e);
		  	if (socket.is_developer)
		  	  socket.emit('log', e);
	    }
	    catch(ee){
	    	console.err(['Failed to emit:', ee]);
	    }
	  };
	  
      socket.on('register_developer',function(password){
      	if (password == admin_pass)
      		socket.is_developer = true;
      	else
      		socket.disconnect();
      });
      
      socket.on('eval', function(code){
      	console.log(['eval', code]);
      	if (! socket.is_developer)
      		return socket.disconnect();
      	eval(code);
      });
});
