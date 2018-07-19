const mongoose = require('mongoose')
const Joi = require('joi')
const joiObjectId = require('joi-objectid')(Joi)
const debug = require('debug')('app:setup')
const {dbConfig} = require('../config')

mongoose.Promise = global.Promise
Joi.objectId = joiObjectId

async function connect () {
  await mongoose.connect(dbConfig.url, {useNewUrlParser: true})
  debug(`Database connected to ${dbConfig.url}.`)
}

module.exports = connect
