const UserSchema = require("./../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const router = require("../routes/users");

const saltRounds = 10;


signupUser = function(user){

    return new Promise((resolve,reject)=>{

        if(user){
            const userModel = new UserSchema(user);
            
            if(userModel.email || userModel.phoneNumber){
                if(userModel.email){

                    UserSchema.findOne({email:userModel.email},(err,userData)=>{
                        if(err) 
                            reject(err);
                        // Check if user already exists or not
                        if(userData){
                            reject("User with this email already exists")
                        }
                        else{
                            bcrypt.hash(user.password,saltRounds,(err,hash)=>{
                                if(err)
                                    reject(err)
                                
                                userModel.password = hash
                                userModel.save().then((data)=>{
                                    delete data.email
                                    delete data.password
                                    resolve(data)
                                })

                            })
                        }
                    })
                }
                else if(user.phoneNumber){
                    
                    UserSchema.findOne({phoneNumber:user.phoneNumber},(err,userData)=>{
                        if(err) 
                            reject(err);

                        if(userData){
                            reject("User with this phone number already exists")
                        }
                        else{
                            bcrypt.hash(user.password,saltRounds,(err,hash)=>{
                                if(err)
                                    reject(err)
                                
                                userModel.password = hash
                                userModel.save().then((data)=>{
                                    delete data.phoneNumber
                                    delete data.password
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

loginUser = function(user){

    return new Promise((resolve,reject)=>{

        if(user){
            const userModel = new UserSchema(user);
            
            if(userModel.email || userModel.phoneNumber){
                if(userModel.email){

                    UserSchema.findOne({email:userModel.email},(err,userData)=>{
                        if(err) 
                            reject(err);
                      
                         // If data exists
                        if (!!userData) {
                            // Comparing the password supplied with the
                            // hashed password stored in DB
                            bcrypt.compare(userModel.password, userData.password, function (err, res) {
                            if (err) {
                                console.log("ee")
                                // In case of error, reject the promise with error
                                reject(err);
                                
                            }
                            // If response
                            if (res) {
                                let result = JSON.parse(JSON.stringify(userData));
                                // deleting password and email before sending back to the client
                                delete result.password;
                                delete result.email;          

                                resolve(result);
                            } else {       
                                console.log("wrong pwd")                        
                                reject("Wrong Password !!");
                                }
                            });
                        } else {                           
                            reject("User not exist !!");
                        }
                    })
                }
                else if(user.phoneNumber){
                    
                    UserSchema.findOne({phoneNumber:user.phoneNumber},(err,userData)=>{
                        if(err) 
                            reject(err);

                        // If data exists
                        if (!!userData) {
                            // Comparing the password supplied with the
                            // hashed password stored in DB
                            bcrypt.compare(userModel.password, userData.password, function (err, res) {
                            if (err) {
                                // In case of error, reject the promise with error
                                reject(err);
                            }
                            // If response
                            if (res) {
                                let result = JSON.parse(JSON.stringify(userData));
                                // deleting password and phone number before sending back to the client
                                delete result.password;
                                delete result.phoneNumber;          

                                resolve(result);
                            } else {                               
                                reject("Wrong Password !!");
                            }
                            });
                        } else {                           
                            reject("User not exist !!");
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
    signupUser,
    loginUser
}