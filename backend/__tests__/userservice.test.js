const request = require('supertest');
const app = require('../db/testEnv');
const User = require('../models/user');
const userservice = require('../services/userservice');

beforeEach(async () => {
  await User.deleteMany({});
});

const user = {
  email: 'vishal@gmail.com',
  phoneNumber: '9999025595',
  password: '1234',
};

// test('Should sign up for a user with an email', async () => {
//   await request(app).post('signup').send(user).expect(200);
// });

// test('Should login a user with an email', async () => {
//   await request(app).post('login').send(user).expect(200);
// });

test('Should signup for a user with a phoneNumber', async () => {
  await userservice
    .signupUser({ phoneNumber: user.phoneNumber, password: user.password })
    .then((response) => {
      expect(response).toBeTruthy();
    });
});

test('Should signup for a user with an email', async () => {
  await userservice
    .signupUser({ email: user.email, password: user.password })
    .then((response) => {
      expect(response).toBeTruthy();
    });
});
