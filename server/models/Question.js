var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const questionSchema = new Schema ({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, "missing title"]
  },
  description: {
    type: String,
    required: [true, "missing description"]
  },
  upvote: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvote: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question;
