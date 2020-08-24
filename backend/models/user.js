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
        type:String
    },
    city:{
        type:String
    }
})

module.exports = mongoose.model('user',UserSchema,'user')