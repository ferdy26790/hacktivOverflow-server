const jwt = require('jsonwebtoken')
const questionModel = require('../models/Question')
const getDecode = require('../helper/getDecode')
class Question {
  static addQuestion (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        let newQuestion = new questionModel({
          userId: decode.id,
          title: req.body.title,
          description: req.body.description
        })
        console.log(newQuestion)
        newQuestion.save()
          .then((questionCreated) => {
            res.status(200).json({
              msg: "question created",
              question: questionCreated
            })
          }).catch((err) => {
            console.log(err)
            res.status(500).send(err)
          })
      }).catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })
  }

  static removeQuestion (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        questionModel.findById(req.params.id)
          .then((question) => {
            if (question.userId === decode.id || decode.role === 'admin') {
              questionModel.findByIdAndRemove(question._id)
                .then((questionDeleted) => {
                  res.status(200).json({
                    msg: "question deleted",
                    question: questionDeleted
                  })
                }).catch((err) => {
                  res.status(500).send(err)
                })
            } else {
              res.status(403).res.send('forbidden')
            }
          }).catch((err) => {
            res.status(500).send(err)
          })
      }).catch((err) => {
        res.status(401).send(err)
      })
  }

  static getAllQuestion (req, res) {
    questionModel.find()
      .populate('userId', 'name')
      .then((questions) => {
        res.status(200).json({
          questions: questions
        })
      }).catch((err) => {
        res.status(500).send(err)
      })
  }

  static getQuestion (req, res) {
    questionModel.findById(req.params.id)
      .populate('userId', 'name')
      .then((question) => {
        res.status(200).json({
          question: question
        })
      }).catch((err) => {
        res.status(500).send(err)
      })
  }

  static getUserQuestions (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        questionModel.find({userId: decode.id})
          .then((questions) => {
            res.status(200).json({
              questions: questions
            })
          }).catch((err) => {
            res.status(500).send(err)
          })
      }).catch((err) => {
        res.status(500).send(err)
      })
  }

  static editQuestion (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        questionModel.findById(req.params.id)
          .then((question) => {
            if (question.userId === decode.id) {
              question.title = req.body.title || question.title
              question.description = req.body.description || question.description
              question.save()
                .then((questionEdited) => {
                  res.status(200).json({
                    msg: "question updated",
                    question: questionEdited
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

  static questionUpvote (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        // cek userId dengan question userid
        questionModel.findById(req.params.id)
          .then((question) => {
            if (question.userId === decode.id) {
              res.status(403).send('forbidden')
            } else {
              //cek di upvote user id nya
              let isDownvote = question.downvote.indexOf(decode.id)
              let isUpvote = question.upvote.indexOf(decode.id)
              if (isUpvote !== -1) {
                res.status(403).send('forbidden')
              } else {
                //cek di downvote user id nya
                if (isDownvote === -1) {
                  // kalo ga ada di langsung gas
                  question.upvote.push(decode.id)
                  question.save()
                    .then((questionUpdated) => {
                      res.status(200).json({
                        msg: "question updated",
                        question: questionUpdated
                      })
                    }).catch((err) => {
                      res.status(500).send(err)
                    })
                } else {
                  // kalo ada delete yang di downvote masukin ke upvote
                  question.downvote.splice(isDownvote, 1)
                  question.upvote.push(decode.id)
                  question.save()
                    .then((questionUpdated) => {
                      res.status(200).json({
                        msg: "question updated",
                        question: questionUpdated
                      })
                    }).catch((err) => {
                      res.status(500).send(err)
                    })
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

  static questionDownvote (req, res) {
    getDecode(req.headers.token)
      .then((decode) => {
        questionModel.findById(req.params.id)
          .then((question) => {
            if (question.userId === decode.id) {
              res.status(403).send('forbidden')
            }
            // cek di upvote udah ada apa blm
            let isUpvote = question.upvote.indexOf(decode.id)
            let isDownvote = question.downvote.indexOf(decode.id)
            if (isUpvote !== -1) {
              if (isDownvote !== -1) {
                res.status(403).send('forbidden')
              } else {
                question.upvote.splice(isUpvote, 1)
                question.downvote.push(decode.id)
                question.save()
                  .then((questionUpdated) => {
                    res.status(200).json({
                      msg: "question updated",
                      question: questionUpdated
                    })
                  }).catch((err) => {
                    res.status(500).send(err)
                  })
              }
            } else {
              if (isDownvote !== -1) {
                res.status(403).send('forbidden')
              } else {
                question.downvote.push(decode.id)
                question.save()
                  .then((questionUpdated) => {
                    res.status(200).json({
                      msg: "question updated",
                      question: questionUpdated
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

module.exports = Question;
