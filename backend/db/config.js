const config = {
  development: {
    url: 'mongodb://localhost/contacts',
  },
  production: {
    url: process.env.MONGO_URL,
  },
  test: {
    url: 'mongodb://localhost/contacts-test',
  },

  clientUrl: 'http://localhost:4200/',
};

module.exports = config;
