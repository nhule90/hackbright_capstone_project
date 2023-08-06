require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const {SERVER_PORT} = process.env
const {seed, getQuestions, getQuestionIds, createQuestion, updateQuestion ,deleteQuestion} = require('./controller.js')

app.use(express.json())
app.use(cors())

// DEV
app.post('/seed', seed)

// QUESTIONS
app.get('/api/questions', getQuestions)
app.get('/api/questionids', getQuestionIds)
app.post('/api/questions', createQuestion)
app.put('/api/questions/:id', updateQuestion)
app.delete('/api/questions/:id', deleteQuestion)

app.listen(SERVER_PORT, () => console.log(`up on ${SERVER_PORT}`))