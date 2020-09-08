const UserSchema = require('./../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
//const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config();
const config = require('../db/config');
const jwt = require('../helpers/token');

const saltRounds = 10;

signupUser = function (user) {
  return new Promise((resolve, reject) => {
    if (user) {
      const userModel = new UserSchema(user);

      if (userModel.email || userModel.phoneNumber) {
        if (userModel.email) {
          UserSchema.findOne({ email: userModel.email }, (err, userData) => {
            if (err) reject(err);

            if (userData) {
              reject('User with this email already exists');
            } else {
              hashPasswordAndSaveUser(user, userModel, resolve);
            }
          });
        } else if (user.phoneNumber) {
          UserSchema.findOne(
            { phoneNumber: user.phoneNumber },
            (err, userData) => {
              if (err) reject(err);

              if (userData) {
                reject('User with this phone number already exists');
              } else {
                hashPasswordAndSaveUser(user, userModel, resolve);
              }
            }
          );
        }
      } else {
        reject('Enter a valid email or phone number to register');
      }
    }
  });
};

loginUser = function (user) {
  return new Promise((resolve, reject) => {
    if (user) {
      const userModel = new UserSchema(user);

      if (userModel.email || userModel.phoneNumber) {
        if (userModel.email) {
          UserSchema.findOne({ email: userModel.email }, (err, userData) => {
            if (err) reject(err);

            if (!!userData) {
              comparePassword(userModel, userData, resolve, reject);
            } else {
              reject('User not exist !!');
            }
          });
        } else if (user.phoneNumber) {
          UserSchema.findOne(
            { phoneNumber: user.phoneNumber },
            (err, userData) => {
              if (err) reject(err);

              if (!!userData) {
                comparePassword(userModel, userData, resolve, reject);
              } else {
                reject('User not exist !!');
              }
            }
          );
        }
      } else {
        reject('Enter a valid email or phone number to register');
      }
    }
  });
};

hashPasswordAndSaveUser = function (user, userModel, resolve) {
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err) reject(err);

    userModel.password = hash;
    userModel.save().then((data) => {
      const token = jwt.tokenCreation(data);
      resolve({ token: token, _id: data._id });
    });
  });
};

hashPasswordAndUpdateUser = function (userId, passwordBody, resolve, reject) {
  bcrypt.hash(passwordBody.new, saltRounds, (err, hash) => {
    if (err) reject(err);

    UserSchema.findByIdAndUpdate(userId, { password: hash }, (err, user) => {
      if (err) reject(err);

      resolve(user);
    });
  });
};

comparePassword = function (userModel, userData, resolve, reject) {
  bcrypt.compare(userModel.password, userData.password, function (err, res) {
    if (err) {
      reject(err);
    }
    if (res) {
      let result = JSON.parse(JSON.stringify(userData));
      const token = jwt.tokenCreation(result);
      resolve({ token: token, _id: result._id });
    } else {
      reject('Wrong Password !!');
    }
  });
};

getUserProfile = function (userId) {
  return new Promise((resolve, reject) => {
    UserSchema.findById(userId, (err, user) => {
      if (err) {
        reject(err);
      }
      if (user) {
        resolve(user);
      } else {
        reject('User not found');
      }
    });
  });
};

saveUserProfile = function (userId, user) {
  return new Promise((resolve, reject) => {
    UserSchema.find(
      {
        $or: [{ email: user.email }, { phoneNumber: user.phoneNumber }],
        _id: { $ne: new ObjectId(userId) },
      },
      (err, userData) => {
        if (err) {
          reject(err);
        }

        if (userData && userData.length > 0) {
          reject('User with this email or phone number already exists');
        } else {
          UserSchema.findByIdAndUpdate(
            userId,
            user,
            { new: true },
            (err, userData) => {
              if (err) {
                reject(err);
              }
              if (userData) {
                resolve(user);
              } else {
                reject('User not found');
              }
            }
          );
        }
      }
    );
  });
};

resetPassword = function (userId, passwordBody) {
  return new Promise((resolve, reject) => {
    UserSchema.findById(userId, (err, user) => {
      if (err) reject(err);

      if (user) {
        if (passwordBody.old) {
          bcrypt.compare(passwordBody.old, user.password, (err, result) => {
            if (err) reject(err);

            if (result) {
              hashPasswordAndUpdateUser(userId, passwordBody, resolve, reject);
            } else {
              reject('Incorrect Old Password');
            }
          });
        } else {
          hashPasswordAndUpdateUser(userId, passwordBody, resolve, reject);
        }
      }
    });
  });
};

forgotPassword = function (userInfo) {
  return new Promise((resolve, reject) => {
    if (userInfo.email) {
      UserSchema.findOne({ email: userInfo.email }, (err, user) => {
        if (err) reject(err);
        if (user) {
          sendEmail(userInfo.email, user._id)
            .then((data) => {
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject(
            'This email is not registered with us. Please provide a valid email.'
          );
        }
      });
    } else {
      UserSchema.findOne({ phoneNumber: userInfo.phoneNumber }, (err, user) => {
        if (err) reject(err);

        if (user) {
          if (user.email) {
            sendEmail(user.email, user._id)
              .then((data) => resolve(data))
              .catch((err) => reject(err));
          } else {
            reject('Update your profile with email');
          }
        } else {
          reject(
            'This phone number is not registered with us. Please provide a valid phone number.'
          );
        }
      });
    }
  });
};

sendEmail = function (email, userId) {
  return new Promise((resolve, reject) => {
    transport = nodemailer.createTransport({
      host: process.env.emailHost,
      port: process.env.emailPort,
      secure: true,
      auth: {
        user: process.env.emailUser,
        pass: process.env.emailPassword,
      },
    });

    const message = {
      from: process.env.emailUser,
      to: email,
      subject: 'Reset Password',
      html:
        '<h4><b>Reset Password</b></h4>' +
        '<p>To reset your password, complete this form:</p>' +
        '<a href=' +
        config.clientUrl +
        'reset/' +
        userId +
        '">Reset Password</a>' +
        '<br><br>' +
        '<p>--Team</p>', // Plain text body
    };

    transport.sendMail(message, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve('email send successfully');
      }
    });
  });
};

getAllUsers = function (userId) {
  return new Promise((resolve, reject) => {
    UserSchema.find({ _id: { $ne: new ObjectId(userId) } }, (err, users) => {
      if (err) reject(err);

      if (users && users.length > 0) {
        let modifiedArray = users.map((x) => {
          return {
            location: x['state']['name']
              ? x['state']['name'] + ', ' + x['city']['name']
              : x['state']['name'],
            name: x['name'],
            email: x['email'],
            phoneNumber: x['phoneNumber'],
            dob: x['dob'],
            userId: x['id'],
          };
        });

        resolve(modifiedArray);
      } else reject('No User found');
    }).sort({ name: 1 });
  });
};

addFriend = function (userId, friend) {
  return new Promise((resolve, reject) => {
    UserSchema.findOneAndUpdate(
      { _id: userId },
      {
        $addToSet: {
          friends: friend,
        },
      },
      {
        new: true,
        upsert: true,
        useFindAndModify: false,
      },
      (err, user) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      }
    );
  });
};

getFriends = function (userId) {
  return new Promise((resolve, reject) => {
    UserSchema.findOne({ _id: userId }, (err, user) => {
      if (err) reject(err);

      if (user) {
        resolve(user.friends);
      }
    });
  });
};

module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  saveUserProfile,
  resetPassword,
  forgotPassword,
  getAllUsers,
  addFriend,
  getFriends,
};
