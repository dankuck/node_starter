/*
 * Do like this:
 * 
 * var http = require('./lib/http_handler.js');
 * http.public.item = function(id){
 *  this.item = ...blahblahblah...;
 * };
 * http.public.item.do_thing_to_item = function(){
 *  this.item.do_thing();
 *  this.res.writeHead(200);
 *  this.res.end("Done it.");
 * };
 * 
 * this is an object created just for this request. It has this.res, this.req, and this.path 
 * so you can do extra stuff if you want. You can set values on it for the sub-actions 
 * if you want.
 * 
 * this.path is an array of the path.
 * 
 * The handler shifts the first item off of path to find the function, then shifts off as many 
 * arguments as that function has. If you want optional extra arguments, shift them off 
 * this.path yourself.
 * 
 * When your action is complete, if there are more items left on the path, the handler will
 * look for the next action as a sub-method, like in the example.
 *
 * http.public.index is the default used if request is just /.
 * There's an existing one that is boring. Replace it.
 *  
 */

(function(){
	
	var self = this;
	var fs = require('fs');
	
	self.public = {
		index: function(){
			this.res.writeHead(200);
			this.res.end("Nothing to see here folks.");
		}
	};
	self.check_static = function(path, res){
		if (! path.length)
			return false;
		var file = path.join('/').replace(/\/\.+/, '/');
		fs.readFile(__dirname + '/../static/' + file,
				  function (err, data) {
				    if (err) {
				      res.writeHead(500);
				      console.log(err);
				      return res.end('Error loading HTTP/HTML Response');
				    }
				
				    res.writeHead(200);
				    res.end(data);
				  }
		);
		return true;
	};
	
	this.handler = function (req, res) {
	  var path = req.url.split(/\//);
	  path.shift(); // ignore the leading /
	  if (path[0] == '')
		  path[0] = 'index';
	  var thing = { 
			  		res: res, 
			  		req: req,
			  		path: path
			  	};
	  var root = self.public;
	  var munch = function(){
		  if (! path.length)
		  	return;
		  if (root == self.public && ! root[path[0]] && self.check_static(path, res))
			return;
		  var action = path.shift();
		  if (root[action]){
			  try{
				  root[action].apply(thing, path.splice(0, root[action].length));
				  root = root[action];
			  }
			  catch (e){
				  res.writeHead(500);
				  res.end("Error :(");
				  console.log(e);
				  return;
			  }
		  }
		  else{
		    res.writeHead(404);
		    res.end("No such action: " + action.replace(/</, '&lt;').replace(/&/, '&amp;'));
		    return;
		  }
		  process.nextTick(munch)
	  };
	  process.nextTick(munch);
	};
}).apply(this);
