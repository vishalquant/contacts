const winston = require("winston");

module.exports = logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
   
    transports: [
       
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            level: 'debug'
        })
    ]
});


module.exports = {
    logInfo(methodName,fileName,routeName){
        logger.info("Method: "+methodName, { defaultMeta:'['+ new Date().toLocaleString()+'] file: '+fileName+' route: '+routeName })   
    },

    logError(methodName,fileName,routeName,err){
        logger.error("Method: "+methodName +", Err: "+err, { defaultMeta:'['+ new Date().toLocaleString()+'] file: '+fileName+' route: '+routeName })   
    }
}
// If we're not in production then log to the `console`
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}