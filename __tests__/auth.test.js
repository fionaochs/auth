require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'test user', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test user',
          __v: 0
        });
      });
  });

  it('logs in a user', async() => {
    await User.create({ username: 'test user', password: 'password' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'test user', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test user',
          __v: 0
        });
      });
  });

  it('fails to login a user with bad password', async() => {
    await User.create({ username: 'test user', password: 'password' });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'test user', password: 'badPassword' })
      .then(res => {
        expect(res.body).toEqual({
          message: 'Invalid username/password', 
          status: 403
        });
      });
  });
});
