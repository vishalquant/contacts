const jwt = require('jsonwebtoken');

const tokenCreation = function (data) {
  let userPayLoad = '';
  if (data.email) {
    userPayLoad = {
      email: data.email,
    };
  } else {
    userPayLoad = {
      phoneNumber: data.phoneNumber,
    };
  }
  return jwt.sign(userPayLoad, process.env.ACCESS_TOKEN_KEY);
};

const verifyTokenFunc = function (req, res, next) {
  const header = req.get('Authorization');
  const accessToken = header && header.split(' ')[1];

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

module.exports = {
  tokenCreation,
  verifyTokenFunc,
};
