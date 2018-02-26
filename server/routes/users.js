var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController')
var questionController = require('../controllers/questionController')
var answerController = require('../controllers/answerController')
/* GET users listing. */
router.post('/register', userController.register)
router.post('/login', userController.login)
router.put('/edit/:id', userController.editUser)
router.post('/addAdmin', userController.createAdmin)
router.delete('/delete/:id', userController.deleteUser)
router.get('/me/questions', questionController.getUserQuestions)
router.get('/questions', questionController.getAllQuestion)
router.get('/questions/:id', questionController.getQuestion)
router.post('/question', questionController.addQuestion)
router.delete('/questions/:id', questionController.removeQuestion)
router.put('/question/:id/upvote', questionController.questionUpvote)
router.put('/question/:id/downvote', questionController.questionDownvote)
router.get('/question/:id/answers', answerController.getAnswersByQuestion)
router.post('/question/:id/answer', answerController.addAnswer)
router.delete('/question/answer/:id', answerController.removeAnswer)
router.put('/question/answer/:id/upvote', answerController.answerUpvote)
router.put('/question/answer/:id/downvote', answerController.answerDownvote)
module.exports = router;
