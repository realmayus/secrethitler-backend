import express from 'express'
import path = require('path')
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes'
var usersRouter = require('./routes/users')

console.log('hi')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

module.exports = app
