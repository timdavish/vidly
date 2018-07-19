const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {User} = require('../../../models/User')
const {authConfig} = require('../../../config')

describe('user.toJSON', () => {
  it('should return client-appropriate properties', () => {
    const userData = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Tim',
      email: 'tim@email.com',
      password: 'password',
      isAdmin: true,
    }
    const user = new User(userData)
    const userJSON = user.toJSON()

    const props = Object.keys(userData)
    const blacklistProps = ['password']
    props.forEach(prop => {
      if (blacklistProps.includes(prop)) {
        expect(userJSON).not.toHaveProperty(prop)
      } else {
        expect(userJSON).toHaveProperty(prop, userData[prop])
      }
    })
  })
})

describe('user.generateAuthToken', () => {
  it('should return a valid jwt', () => {
    const userData = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true}
    const user = new User(userData)
    const token = user.generateAuthToken()
    const decoded = jwt.verify(token, authConfig.jwtSecret)

    expect(decoded).toMatchObject(userData)
  })
})
