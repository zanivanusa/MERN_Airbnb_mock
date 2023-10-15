var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  content: String,
  photo: {
    type: Schema.Types.ObjectId,
    ref: 'photo'
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('comment', commentSchema);
