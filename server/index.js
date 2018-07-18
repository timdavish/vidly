const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')
const debug = require('debug')('app')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const errorHandler = require('./middleware/errorHandler')

const app = express()
const isDev = process.env.NODE_ENV === 'dev'

app.use(express.static('./public'))
app.use(bodyParser.json({limit: '1mb'}))
app.use(bodyParser.urlencoded({extended: true}))

app.use(helmet())

const morganFormat = isDev ? 'dev' : 'combined'
app.use(morgan(morganFormat, {skip: (req, res) => res.statusCode < 400, stream: process.stderr}))
app.use(morgan(morganFormat, {skip: (req, res) => res.statusCode >= 400, stream: process.stdout}))

app.use('/', require('./routes'))
app.use(errorHandler())

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(() => console.error('Could not connect to MongoDB...'))

const port = process.env.PORT || 3000
app.listen(port, () => debug(`Server listening on port ${port}`))
