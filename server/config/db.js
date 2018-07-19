const appConfig = require('./app')

const dbConfig = {
  get url () {
    switch (appConfig.env) {
      case 'dev': return 'mongodb://localhost:27017/vidly'
      case 'test': return 'mongodb://localhost:27017/vidly_test'
      default: return ''
    }
  }
}

module.exports = dbConfig
