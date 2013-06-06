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
  ;

app.listen(user_port);
