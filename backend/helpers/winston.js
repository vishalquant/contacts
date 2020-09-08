const winston = require('winston');

let logger;
if (!winston.loggers.length) {
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),

    transports: [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        level: 'debug',
      }),
    ],
  });
}

module.exports = logger;
