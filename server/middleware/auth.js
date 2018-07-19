const jwt = require('jsonwebtoken')
const {authConfig} = require('../config')

function auth ({required = false} = {}) {
  return (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).json({error: 'Access denied. No token provided.'})

    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret)
      req.user = decoded
      next()
    } catch (error) {
      if (required) return res.status(400).json({error: 'Access denied. Invalid token provided.'})
      next()
    }
  }
}

module.exports = {required: auth({required: true}), optional: auth()}
