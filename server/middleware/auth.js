const jwt = require('jsonwebtoken')
const {authConfig} = require('../config')

function generateAuth (options = {}) {
  const {userProperty = 'user', required = false} = options

  return (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).json({error: 'Access denied. No token provided.'})

    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret)
      req[userProperty] = decoded
      next()
    } catch (error) {
      if (required) return res.status(400).json({error: 'Access denied. Invalid token provided.'})
      next()
    }
  }
}

module.exports = {required: generateAuth({required: true}), optional: generateAuth()}
