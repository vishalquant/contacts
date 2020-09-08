const config = {
  development: {
    url: 'mongodb://localhost/contacts',
  },
  production: {
    url: process.env.MONGO_URL,
  },
  clientUrl: 'http://localhost:4200/',
};

module.exports = config;
