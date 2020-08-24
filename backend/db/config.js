const dotenv = require('dotenv').config();
console.log(process.env.MONGO_URL)
const config = {
    development: {
        url: 'mongodb://localhost/contacts',
    },
    production: {
        
        url: process.env.MONGO_URL,
    }
};

module.exports = config;