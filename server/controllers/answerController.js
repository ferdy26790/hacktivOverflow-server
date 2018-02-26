const jwt = require('jsonwebtoken')
const getDecode = require('../helper/getDecode')
const answerModel = require('../models/Answer')
const mailer = require('../helper/mailer')
const questionModel = require('../models/Question')
class Answer{
  static addAnswer (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        let newAnswer = new answerModel({
          userId: decode.id,
          questionId: req.params.id,
          answer: req.body.answer
        })
        newAnswer.save()
          .then((answerCreated) => {
            questionModel.findById(req.params.id)
              .populate('userId')
              .then((question) => {
                let html = `<strong> You Got Answers Go check it Now! </strong>
                            <br>
                            by click this <a href="http://localhost:8080">link</a>`
                mailer(question.userId.email, html)
                res.status(200).json({
                  msg: "answer created",
                  answer: answerCreated
                })
              }).catch((err) => {
                res.status(500).send(err)
              })
          }).catch((err) => {
            res.status(500).send(err)
          })
      }).catch((err) => {
        res.status(500).send(err)
      })
  }

  static removeAnswer (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        answerModel.findById(req.params.id)
          .then((answer) => {
            if (answer._id == decode.id) {
              answerModel.findByIdAndRemove()
                .then((answerDeleted) => {
                  res.status(200).json({
                    msg: "answer deleted",
                    answer: answerDeleted
                  })
                }).catch((err) => {
                  res.status(500).send(err)
                })
            } else {
              res.status(403).send('forbidden')
            }
          }).catch((err) => {
            res.status(500).send(err)
          })
      }).catch((err) => {
        res.status(500).send(err)
      })
  }

  static getAnswersByQuestion (req, res) {
    answerModel.find({
      questionId: req.params.id
    })
      .populate('userId', 'name')
      .then((answers) => {
        res.status(200).json({
          answers: answers
        })
      }).catch((err) => {
        res.status(500).send(err)
      })
  }

  static answerDownvote (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        answerModel.findById(req.params.id)
          .then((answer) => {
            if (answer.userId == decode.id) {
              res.status(403).send('forbidden')
            } else {
              let isUpvote = answer.upvote.indexOf(decode.id)
              let isDownvote = answer.downvote.indexOf(decode.id)
              if (isDownvote !== -1) {
                res.status(403).send('forbidden')
              } else {
                if (isUpvote !== -1) {
                  answer.upvote.splice(isDownvote, 1)
                  answer.downvote.push(decode.id)
                  answer.save()
                    .then((answerUpdated) => {
                      res.status(200).json({
                        msg: "answer updated",
                        answer: answerUpdated
                      })
                    }).catch((err) => {
                      res.status(500).send(err)
                    })
                } else {
                  answer.downvote.push(decode.id)
                }
              }
            }
          }).catch((err) => {
            res.status(500).send(err)
          })
      }).catch((err) => {
        res.status(500).send(err)
      })
  }

  static answerUpvote (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        answerModel.findById(req.params.id)
          .then((answer) => {
            if (answer.userId == decode.id) {
              res.status(403).send('forbidden')
            }
            let isUpvote = answer.upvote.indexOf(decode.id)
            let isDownvote = answer.downvote.indexOf(decode.id)
            if (isUpvote !== -1) {
              res.status(403).send('forbidden')
            } else {
              if (isDownvote !== -1) {
                answer.downvote.splice(isDownvote, 1)
                answer.upvote.push(decode.id)
                answer.save()
                  .then((answerUpdated) => {
                    res.status(200).json({
                      msg: "answer updated",
                      answer: answerUpdated
                    })
                  }).catch((err) => {
                    res.status(500).send(err)
                  })
              } else {
                answer.upvote.push(decode.id)
                answer.save()
                  .then((answerUpdated) => {
                    res.status(200).json({
                      msg: "answer updated",
                      answer: answerUpdated
                    })
                  }).catch((err) => {
                    res.status(500).send(err)
                  })
              }
            }
          }).catch((err) => {
            res.status(500).send(err)
          })
      }).catch((err) => {
        res.status(500).send(err)
      })
  }

}

module.exports = Answer;
