'use strict'
global.DATABASE_URL = 'mongodb://localhost/react-test-login'
const db = 'mongodb://localhost/react-test-db-login'
const chai = require('chai')
const chaiHttp = require('chai-http')
const {app, runServer, closeServer} = require('../server')
const User = require('../models/User')
const expect = chai.expect
chai.use(chaiHttp)
const bcrypt = require('bcryptjs')

  const email = 'testlogin@gmail.com'
  const name = 'testlogin'
  const password = 'testlogin'

 

  before(function() {
    runServer(db)
    const newUser = new User({name, email, password})
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser
          .save()
          .then(user => ({}))
          .catch(err => console.log(err))
      })
    })
  })

  after(function() { 
    User.collection.drop()
    closeServer()
  })


  afterEach(function(){
    // User.remove({})
  })

  // LOGIN ROUTE 
  describe('LOGIN ROUTE', function() {

    it('Should work with existing user and return auth Token', function () {
      return chai
        .request(app)
        .post('/api/users/login')
        .send({ email, password })
        .then(res => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          const token = res.body.token
          expect(token).to.be.a('string')
        })
    })
    it('Should fail with incorrect username', function () {
      return chai
        .request(app)
        .post('/api/users/login')
        .send({ email: 'fake@fake.com', password })
        .then(res => {
          expect(res).to.have.status(404)
        })
    })
    it('Should fail with incorrect password', function () {
      return chai
        .request(app)
        .post('/api/users/login')
        .send({ email, password: 'fakeEmail'})
        .then(res => {
          expect(res).to.have.status(400)
        })
    })
    it('Should defo fail with no req.body', function () {
      return chai
        .request(app)
        .post('/api/users/login')
        .then((res) => {})
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(400);
        })
    })
}) 

// REGISTRATION ROUTE 
describe('REGISTRATION ROUTE', function() {
  it('Should work with new user with valid reg details', function () {
    return chai
      .request(app)
      .post('/api/users/register')
      .send({ name: 'reg', email: 'reg@gmail.com', password: 'regpass', password2: 'regpass' })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object')
        // const token = res.body.token
        // expect(token).to.be.a('string')
      })
  })
  it('Should fail if passwords do not match', function () {
    return chai
      .request(app)
      .post('/api/users/register')
      .send({ name: 'reg', email: 'reg@gmail.com', password: 'regpass', password2: 'mistake' })
      .then(res => {
        expect(res).to.have.status(400)
      })
  })
  it('Should prevent reg if same email exists on db', function () {
    return chai
      .request(app)
      .post('/api/users/register')
      .send({ name: 'reg', email: 'testlogin@gmail.com', password: 'regpass', password2: 'regpass' })
      .then(res => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object')
        // const token = res.body.token
        // expect(token).to.be.a('string')
      })
  }) 
  it('Should prevent reg if email is not a proper url', function () {
    return chai
      .request(app)
      .post('/api/users/register')
      .send({ name: 'reg', email: 'testReg2Short@gmail', password: 'regpass', password2: 'regpass' })
      .then(res => {
        expect(res).to.have.status(400);
      })
  })  
})

