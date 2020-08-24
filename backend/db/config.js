const config = {
    development: {
        url: 'mongodb://localhost/contacts',
    },
    production: {
        url: 'mongodb://admin:admin123@ds361968.mlab.com:61968/contacts',
    }
};

module.exports = config;