const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    email:{
		type: String
	},
    password:{
		type: String, 
		required: true		
    },
    phoneNumber:{
        type:Number
    },
    name:{
        type:String
    },
    dob:{
        type:Date
    },
    state:{       
        id:String,
        name:String,
        country_id:String        
    },
    city:{
       id:String,
       name:String,
       state_id:String
    },
    friends:[{
        name:String,
        phoneNumber:String,
        email:String,
        location:String
    }]
})

module.exports = mongoose.model('user',UserSchema,'user')