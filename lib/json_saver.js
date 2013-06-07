(function(){
	
	var fs = require('fs');
	
	function Saver(file, cb){
		this[':file'] = file;
		this.refresh(cb);
	};
	Saver.prototype = {
		save: function(){
			var file = this[':file'];
			delete this[':file'];
			var data = JSON.stringify(this);
			this[':file'] = file;
			fs.writeFile(file, data);
		},
		refresh: function(cb){
			fs.readFile(this[':file'], function (err, text) {
				if (err)
					return cb && cb(err, this);
			    var data = JSON.parse(text);
			    delete data[':file'];
				for (var f in data)
					this[f] = data[f];
				cb && cb(null, this);
			}.bind(this));
		}
	};
	
	this.open = function(file, cb){
		new Saver(file, cb);
	};
	
}).apply(this);
