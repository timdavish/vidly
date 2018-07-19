const express = require('express')
const debug = require('debug')('app:setup')
const {appConfig} = require('./config')

const app = express()

require('./setup/config')()
require('./setup/logging')(app)
require('./setup/routes')(app)
require('./setup/db')()

app.listen(appConfig.port, () => debug(`Server listening on port ${appConfig.port}.`))
