'use strict';
global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test'
const chai = require('chai')
const chaiHttp = require('chai-http')
const {app, runServer, closeServer} = require('../server')
const {User} = require('../models/User')
const expect = chai.expect;
chai.use(chaiHttp);

describe('/', function() {

  const username = 'exampleUser';
  const password = 'test';
  const email = 'test@test.com';

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
        User.create({
          username,
          password,
          email
        })
      ); 
  });

  afterEach(function() {
    return User.remove({});
  });

it('should return 200 responce', function() {
    return chai 
    .request(app)
    .get('/')
    .then(res => {
        expect(res).to.have.status(200);
    })
})


it('should return 200 responce', function() {
chai.request(app)
  .post('/api/users/registration')
  .send({ name: 'testReg', email: 'testReg@gmail.com', password: '123'})
  .then(res => {
    expect(res).to.have.status(200)
  })
})

})