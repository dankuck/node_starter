(function(){
	
	var fs = require('fs');
	
	function Saver(file, cb){
		fs.readFile(file, function (err, text) {
			if (err)
				cb(err);
		    var data = JSON.parse(text);
			for (var f in data)
				this[f] = data[f];
			this[':file'] = file;
			cb(null, this);
		}.bind(this));
	};
	Saver.prototype = {
		save: function(){
			var file = this[':file'];
			delete this[':file'];
			var data = JSON.stringify(this);
			this[':file'] = file;
			fs.writeFile(file, data);
		}
	};
	
	this.open = function(file, cb){
		new Saver(file, cb);
	};
	
}).apply(this);
