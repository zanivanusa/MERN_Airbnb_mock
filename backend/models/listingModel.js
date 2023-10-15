var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListingSchema = new Schema({
  title: { type: String},
  description: { type: String},
  price: { type: Number},
  location: { type: String },
  photos: [{ type: Schema.Types.ObjectId, ref: 'Photo' }], // Array of photo references
  postedBy: { type: Schema.Types.ObjectId, ref: 'User'},
  isBooked: { type: Boolean, default: false},
  bookedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who booked the listing

//  likes: { type: Number, default: 0 },
 // dislikes: { type: Number, default: 0 },
 // likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
 // dislikedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  publishTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);
