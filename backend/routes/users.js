const express = require('express');
const router = express.Router();
const userService = require('../services/userservice');
const dataService = require('../services/dataservice');
const verifyToken = require('../helpers/token').verifyTokenFunc;
const logger = require('../helpers/winston');

router.post('/signup', (req, res) => {
  userService
    .signupUser(req.body)
    .then((result) => {
      logger.info('User Signup');
      return res.json(
        dataService.returnSuccess(result, 'Thank you for signing up.')
      );
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

router.post('/login', (req, res) => {
  userService
    .loginUser(req.body)
    .then((result) => {
      logger.info('User Login');
      return res.json(
        dataService.returnSuccess(result, 'Sucessfully logged In')
      );
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

router.get('/profile/:id', verifyToken, (req, res) => {
  userService
    .getUserProfile(req.params.id)
    .then((result) => {
      logger.info('Get User Profile');
      return res.json(
        dataService.returnSuccess(result, 'User Profile Details')
      );
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

router.post('/profile/:id', verifyToken, (req, res) => {
  userService
    .saveUserProfile(req.params.id, req.body)
    .then((result) => {
      logger.info('Update User Profile');
      return res.json(
        dataService.returnSuccess(result, 'Profile saved successfully.')
      );
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

router.patch('/profile/:id', verifyToken, (req, res) => {
  userService
    .resetPassword(req.params.id, req.body)
    .then((result) => {
      logger.info('Update user Password');
      return res.json(
        dataService.returnSuccess(
          result,
          'Password has been successfully reset.'
        )
      );
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

router.post('/forgotpassword', (req, res) => {
  userService
    .forgotPassword(req.body)
    .then((result) => {
      logger.info('Send forget password Email');
      return res.json(
        dataService.returnSuccess(result, 'Email sent to your email Id.')
      );
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

router.get('/:id', verifyToken, (req, res) => {
  userService
    .getAllUsers(req.params.id)
    .then((result) => {
      logger.info('List of users');
      return res.json(dataService.returnSuccess(result, 'List of Users'));
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

router.patch('/friends/:id', verifyToken, (req, res) => {
  userService
    .addFriend(req.params.id, req.body)
    .then((result) => {
      logger.info('Update friends list');
      return res.json(
        dataService.returnSuccess(
          result,
          'Contact added successfully to your friend’s list.'
        )
      );
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

router.get('/friends/:id', verifyToken, (req, res) => {
  userService
    .getFriends(req.params.id, req.body)
    .then((result) => {
      logger.info('Get User Friends');
      return res.json(dataService.returnSuccess(result, 'Friend’s list.'));
    })
    .catch((err) => {
      logger.error(
        `${err.status || 400} - ${err.message} - ${req.originalUrl} - ${
          req.method
        } - ${req.ip}`
      );
      return res.status(400).json(dataService.returnFailure(err));
    });
});

module.exports = router;
