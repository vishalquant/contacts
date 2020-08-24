const mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];


// Build the connection string 
const dbURI = config.url; 
 
// Create the database connection 
mongoose.connect(dbURI, { useNewUrlParser:true , useUnifiedTopology:true}); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
}); 
  
// If the connection throws an error
mongoose.connection.on('error',function (err) { 
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () { 
  console.log('Mongoose default connection disconnected'); 
});