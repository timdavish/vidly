const request = require('supertest')
const mongoose = require('mongoose')
const moment = require('moment')
const {Movie} = require('../../../models/Movie')
const {Rental} = require('../../../models/Rental')
const {User} = require('../../../models/User')

describe('/api/returns', () => {
  let server, customerId, movieId, movie, rental

  beforeEach(async () => {
    server = require('../../../index')

    customerId = mongoose.Types.ObjectId()
    movieId = mongoose.Types.ObjectId()

    movie = new Movie({
      _id: movieId,
      title: '12345',
      genre: {name: '12345'},
      numberInStock: 10,
      dailyRentalRate: 2,
    })
    await movie.save()

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    })
    await rental.save()
  })

  afterEach(async () => {
    await server.close()
    await Movie.remove({})
    await Rental.remove({})
  })

  describe('POST /', () => {
    let token

    const exec = () => request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({customerId, movieId})

    beforeEach(() => {
      token = new User().generateAuthToken()
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''

      const res = await exec()

      expect(res.status).toBe(401)
    })

    it('should return 400 if customerId is not provided', async () => {
      customerId = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if movieId is not provided', async () => {
      movieId = ''

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 404 if no rental found for this customer/movie', async () => {
      await Rental.remove({})

      const res = await exec()

      expect(res.status).toBe(404)
    })

    it('should return 400 if return already processed', async () => {
      rental.dateIn = new Date()
      rental.rentalFee = 0
      await rental.save()

      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 200 if valid request', async () => {
      const res = await exec()

      expect(res.status).toBe(200)
    })

    it('should set the return date on the rental if valid request', async () => {
      expect(rental.dateIn).toBeUndefined()

      await exec()
      rental = await Rental.findById(rental._id)


      const diff = new Date() - rental.dateIn

      expect(diff).toBeLessThan(10000) // 10 seconds
    })

    it('should set the rental fee on the rental if valid request', async () => {
      rental.dateOut = moment().add(-7, 'days').toDate()
      await rental.save()

      await exec()
      rental = await Rental.findById(rental._id)
      const rentalDays = moment().diff(rental.dateOut, 'days')

      expect(rental.rentalFee).toBe(rentalDays * rental.movie.dailyRentalRate)
    })

    it('should add the movie back to stock', async () => {
      const oldNumberInStock = movie.numberInStock

      await exec()
      movie = await Movie.findById(movie._id)

      expect(movie.numberInStock).toBe(oldNumberInStock + 1)
    })

    it('should return summary of the rental', async () => {
      const res = await exec()
      rental = await Rental.findById(rental._id)

      expect(Object.keys(res.body.rental)).toEqual(
        expect.arrayContaining(['customer', 'movie', 'dateOut', 'dateIn', 'rentalFee'])
      )
    })
  })
})
