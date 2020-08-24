const UserSchema = require("./../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const router = require("../routes/users");
const saltRounds = 10;


signupUser = function(user){

    return new Promise((resolve,reject)=>{

        if(user){
            const userModel = new UserSchema(user);
            console.log(userModel)
            if(userModel.email || userModel.phoneNumber){
                if(userModel.email){

                    UserSchema.find({email:userModel.email},(err,userData)=>{
                        if(err) 
                            reject(err);

                        if(userData.length>0){
                            reject("User with this email already exists")
                        }
                        else{
                            bcrypt.hash(user.password,saltRounds,(err,hash)=>{
                                if(err)
                                    reject(err)
                                
                                userModel.password = hash
                                userModel.save().then((data)=>{
                                    resolve(data)
                                })

                            })
                        }
                    })
                }
                else if(user.phoneNumber){
                    
                    UserSchema.find({phoneNumber:user.phoneNumber},(err,userData)=>{
                        if(err) 
                            reject(err);

                        if(userData.length>0){
                            reject("User with this phone number already exists")
                        }
                        else{
                            bcrypt.hash(user.password,saltRounds,(err,hash)=>{
                                if(err)
                                    reject(err)
                                
                                userModel.password = hash
                                userModel.save().then((data)=>{
                                    resolve(data)
                                })

                            })
                        }
                    })
                }
            }
            else{
                reject("Enter a valid email or phone number to register")
            }
        }
        
    })

}

module.exports = {
    signupUser
}