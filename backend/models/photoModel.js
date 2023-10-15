var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'photoPath' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'OnListing' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'listing'
	},
	publishTime: {
		type: Date,
		default: Date.now
	  }
});

module.exports = mongoose.model('Photo', photoSchema);
