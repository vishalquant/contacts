const request = require('supertest');
const app = require('../db/testEnv');
const User = require('../models/user');
const userservice = require('../services/userservice');

let userId;
let mustHaveProperty = '_id';

let token;
let friendsCount = 0;

const user = {
  email: 'vishal.vashisht@quovantis.com',
  phoneNumber: '9999025595',
  password: '1234',
};

let friendObject = {
  email: 'friend@gmail.com',
  phoneNumber: '1919191919',
  location: 'Delhi, New Delhi',
  userId: '123345345345',
  name: 'Your Friend',
};

let objUserWithPhoneNumber = {
  email: 'test@gmail.com',
  phoneNumber: user.phoneNumber,
  dob: new Date().toDateString(),
  state: {
    name: 'Delhi',
    state_id: '1',
  },
  city: {
    name: 'New Delhi',
    city_id: '1',
  },
};

let objUserWithEmail = {
  email: user.email,
  phoneNumber: 9090909090,
  dob: new Date().toDateString(),
  state: {
    name: 'Delhi',
    state_id: '1',
  },
  city: {
    name: 'New Delhi',
    city_id: '1',
  },
};

beforeAll(async () => {
  await User.deleteMany({});
});

// #region  signup
test('Should signup for a user with a phoneNumber: Success', async () => {
  await User.deleteOne({ phoneNumber: user.phoneNumber });

  await userservice
    .signupUser({ phoneNumber: user.phoneNumber, password: user.password })
    .then((response) => {
      expect(response).toHaveProperty(mustHaveProperty);
    });
});


test('Should login a user with phone number: Success', async () => {
  await userservice
    .loginUser({ phoneNumber: user.phoneNumber, password: user.password })
    .then((response) => {
      userId = response._id;
      token = response.token;
      expect(response).toHaveProperty(mustHaveProperty);
    });
});

// test('Should login a user with phone number: Failure', async () => {
//   await userservice
//     .loginUser({ phoneNumber: user.phoneNumber+"_dummy", password: user.password })
//     .then((response) => {
//       userId = response._id;
//       token = response.token;
//       console.log(response)
//       expect(response).toHaveProperty(mustHaveProperty);
//     });
// });

test('Routes: Should signup a user with an phone number', async () => {
  await request(app)
    .post('/signup')
    .send({ phoneNumber: user.phoneNumber, password: user.password })
    .expect(400);
});

test('Routes: Should login a user with an phone number', async () => {
  await request(app)
    .post('/login')
    .send({ phoneNumber: user.phoneNumber, password: user.password })
    .expect(200);
});

//#endregion

//#region  save user profile with phone login
test('Should save the user profile with phone login', async () => {
  await userservice
    .saveUserProfile(userId, objUserWithPhoneNumber)
    .then((response) => {
      expect(response).toHaveProperty(mustHaveProperty);
    });
});

test('Routes: Should save the user profile with phone login', async () => {
  await request(app)
    .post('/profile/' + userId)
    .set('Authorization', 'Authorization ' + token)
    .send(objUserWithPhoneNumber)
    .expect(200);
});

//#endregion

//#region  forgot password with user logged in with phone number
// test('Should be able to send email when forgot password and user has only phonenumber in his profile info', async () => {
//   await userservice
//     .forgotPassword({ phoneNumber: user.phoneNumber })
//     .then((response) => {
//       expect(response).toMatch('successfully');
//     });
// });

test('Routes: Should be able to send email when forgot password and user has only phonenumber in his profile info', async () => {
  await request(app)
    .post('forgotpassword')
    .send({ phoneNumber: user.phoneNumber })
    .expect(200);
});

//#endregion

//#region  signup with email
test('Should signup for a user with an email: Success', async () => {
  await User.deleteOne({ email: user.email });
  await userservice
    .signupUser({ email: user.email, password: user.password })
    .then((response) => {
      expect(response).toHaveProperty(mustHaveProperty);
    });
});

test('Should signup for a user with an email: Failure', async () => {
  await userservice
    .signupUser({ email: user.phoneNumber, password: user.password })
    .then((response) => {
      expect(response).toHaveProperty(mustHaveProperty);
    });
});

test('Should login a user with an email', async () => {
  await userservice
    .loginUser({ email: user.email, password: user.password })
    .then((response) => {
      userId = response._id;
      token = response.token;
      expect(response).toHaveProperty(mustHaveProperty);
    });
});

test('Routes: Should sign up for a user with an email', async () => {
  await request(app)
    .post('/signup')
    .send({ email: user.email, password: user.password })
    .expect(400);
});

test('Routes: Should login with an email: Success Scenario', async () => {
  await request(app)
    .post('/login')
    .send({ email: user.email, password: user.password })
    .expect(200);
});

test('Routes: Should login with an email: Failure Scenario', async () => {
  await request(app)
    .post('/login')
    .send({ email: user.email, password: user.password+"_dummy" })
    .expect(400);
});

//#endregion

//#region  forgot password
// test('Should be able to send email when forgot password and user has only email in his profile info', async () => {
//   await userservice.forgotPassword({ email: user.email }).then((response) => {
//     expect(response).toMatch('successfully');
//   });
// });

test('Routes: Should be able to send email when forgot password and user has only email in his profile info', async () => {
  await request(app)
    .post('forgotpassword')
    .send({ email: user.email })
    .expect(200);
});

//#endregion

//#region  save user profile with email login
test('Should save the user profile with email login', async () => {
  await userservice
    .saveUserProfile(userId, objUserWithEmail)
    .then((response) => {
      expect(response).toHaveProperty(mustHaveProperty);
    });
});

test('Routes: Should save the user profile with email login', async () => {
  await request(app)
    .post('/profile/' + userId)
    .set('Authorization', 'Authorization ' + token)
    .send(objUserWithEmail)
    .expect(200);
});

test('Routes: Should save the user profile with email login: Failure Scenario', async () => {
  await request(app)
    .post('/profile/' + "userId")
    .set('Authorization', 'Authorization ' + token)
    .send(objUserWithEmail)
    .expect(400);
});

//#endregion

//#region  get user profile
test('Should get the user profile', async () => {
  await userservice.getUserProfile(userId).then((response) => {
    testUser = response;
    expect(response).toHaveProperty(mustHaveProperty);
  });
});

test('Routes: Should get the user profile: Success Scenario', async () => {
  await request(app)
    .get('/profile/' + userId)
    .set('Authorization', 'Authorization ' + token)
    .expect(200);
});

test('Routes: Should get the user profile: Failure Scenario', async () => {
  await request(app)
    .get('/profile/' + "userId")
    .set('Authorization', 'Authorization ' + token)
    .expect(400);
});

//#endregion

//#region  reset password
test('Should be able to reset the password', async () => {
  await userservice
    .resetPassword(userId, { old: user.password, new: '456' })
    .then((response) => {
      expect(response).toHaveProperty(mustHaveProperty);
    });
});

// test('Routes: Should be able to reset the password: Success Scenario', async () => {
//   const successUserId = "5f48c9973a69fffbbd1bafa4"
//   await request(app)
//     .patch('/profile/' + successUserId)
//     .set('Authorization', 'Authorization ' + token)
//     .send({ old: "456", new: 123 })
//     .expect(200);
// });

test('Routes: Should be able to reset the password Failure Scenario', async () => {
  await request(app)
    .patch('/profile/' + userId)
    .set('Authorization', 'Authorization ' + token)
    .send({ old: user.password, new: 123 })
    .expect(400);
});
//#endregion

//#region forgotPassword
test('Routes: Should be able to forgot password: Success Scenario', async () => {
  await request(app)
    .post('/forgotpassword')
    .send({ email: user.email })
    .expect(200);
});

test('Routes: Should be able to forgot password: Failure Scenario', async () => {
  await request(app)
    .post('/forgotpassword')
    .send({ emails: user.email }) // passing wrong property
    .expect(400);
});
//#endregion

//#region  fetch all contacts
test('Should be able to fetch all contacts', async () => {
  await userservice.getAllUsers(userId).then((response) => {
    expect(response.length).toBeGreaterThan(0);
  });
});

test('Routes: Should fetch all contacts: Success Scenario', async () => {
  await request(app)
    .get('/' + userId)
    .set('Authorization', 'Authorization ' + token)
    .expect(200);
});

test('Routes: Should fetch all contacts: Failure Scenario', async () => {
  await request(app)
    .get('/' + 'userId')
    .set('Authorization', 'Authorization ' + token)
    .expect(400);
});

//#endregion

//#region  fetch all friends
test('Should be able to fetch all friends', async () => {
  await userservice.getFriends(userId).then((response) => {
    friendsCount = response ? response.length : 0;
    expect(response.length).toEqual(friendsCount);
  });
});

test('Routes: Should be able to fetch all friends: Success Scneario', async () => {
  await request(app)
    .get('/friends/' + userId)
    .set('Authorization', 'Authorization ' + token)
    .expect(200);
});

test('Routes: Should be able to fetch all friends: Failure Scneario', async () => {
  await request(app)
    .get('/friends/' + 'userId')
    .set('Authorization', 'Authorization ' + token)
    .expect(400);
});
//#endregion

//#region  add contact as a friend
test('Should add a contact as a friend', async () => {
  await userservice.addFriend(userId, friendObject).then((response) => {
    expect(response.friends.length).toBeGreaterThan(friendsCount);
  });
});

test('Routes: Should add a contact as a friend: Success Scenario', async () => {
  await request(app)
    .patch('/friends/' + userId)
    .set('Authorization', 'Authorization ' + token)
    .send(friendObject)
    .expect(200);
});

test('Routes: Should add a contact as a friend: Failure Scenario', async () => {
  await request(app)
    .patch('/friends/' + 'userId')
    .set('Authorization', 'Authorization ' + token)
    .send(friendObject)
    .expect(400);
});
//#endregion
