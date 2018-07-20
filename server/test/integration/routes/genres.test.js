const request = require('supertest')
const mongoose = require('mongoose')
const {Genre} = require('../../../models/Genre')
const {User} = require('../../../models/User')

describe('/api/genres', () => {
  let server

  beforeEach(() => {
    server = require('../../../index')
  })

  afterEach(async () => {
    await server.close()
    await Genre.remove({})
  })

  describe('GET /', () => {
    it('should return all genres', async () => {
      const genres = [{name: 'genre1'}, {name: 'genre2'}]
      await Genre.collection.insertMany(genres)

      const res = await request(server).get('/api/genres')

      expect(res.status).toBe(200)
      expect(res.body.genres.length).toBe(2)
      genres.forEach(genre => {
        expect(res.body.genres.some(g => g.name === genre.name)).toBeTruthy()
      })
    })
  })

  describe('GET /:id', () => {
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1')

      expect(res.status).toBe(404)
    })

    it('should return 404 if no genre with valid id', async () => {
      const res = await request(server).get(`/api/genres/${mongoose.Types.ObjectId()}`)

      expect(res.status).toBe(404)
    })

    it('should return a genre if valid id is passed', async () => {
      const genre = new Genre({name: 'genre1'})
      await genre.save()

      const res = await request(server).get(`/api/genres/${genre._id}`)

      expect(res.status).toBe(200)
      expect(res.body.genre).toHaveProperty('name', genre.name)
    })
  })

  describe('POST /', () => {
    let token, name

    const exec = () => request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({name})

    beforeEach(() => {
      token = new User().generateAuthToken()
      name = 'genre1'
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234'

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if genre is greater than 50 characters', async () => {
      name = Array.from({length: 51}, v => 'a').join('')

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should save the genre if it is valid', async () => {
      const res = await exec()
      const genre = await Genre.findOne({name: 'genre1'})

      expect(res.status).toBe(200)
      expect(genre).not.toBeNull()
      expect(genre.name).toBe('genre1')
    })

    it('should return the genre if it is valid', async () => {
      const res = await exec()

      expect(res.status).toBe(200)
      expect(res.body.genre).toHaveProperty('_id')
      expect(res.body.genre).toHaveProperty('name', 'genre1')
    })
  })
})
