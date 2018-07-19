const authConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: 86400 * 14, // 2 weeks
}

module.exports = authConfig
