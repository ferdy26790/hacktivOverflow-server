var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const answerSchema = new Schema ({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: String,
    required: [true, "missing answer"]
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

const Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer;
