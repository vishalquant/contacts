const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

//const UserDetail = new Schema({name: String},{ _id : false })
const UserDetail = new Schema({location: String, name: String, email: String, phoneNumber: Number,dob:Date,userId:ObjectId},{ _id : false })

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
    friends:[UserDetail]
})



module.exports = mongoose.model('user',UserSchema,'user')