const UserSchema = require("./../models/user");
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const router = require("../routes/users");
const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config();
const config = require('../db/config');
const user = require("./../models/user");
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

getUserProfile = function(userId){

   return new Promise((resolve,reject)=>{

    UserSchema.findById(userId,(err,user)=>{
        
        if(err){
            
            reject(err)
        }

        if(user){
            
            resolve(user)
        }
        else{
            reject("User not found")
        }
    
        })
    })
}

saveUserProfile = function(userId,user){

    return new Promise((resolve,reject)=>{
        UserSchema.find({ $or:[{email:user.email},{phoneNumber:user.phoneNumber}], _id: { $ne: new ObjectId(userId) } },(err,userData)=>{

            
            if(err){
                
                reject(err)
            }
    
            if(userData && userData.length>0){     
               reject("User with this email or phone number already exists")       
               // resolve(userData)
            }
            else{
               UserSchema.findByIdAndUpdate(userId,user,{new:true},(err,userData)=>{
                    
                    if(err){
                        reject(err)
                    }
                    if(userData){
                        resolve(user)
                    }
                    else{
                        reject("User not found")
                    }
                
                })
            }

        })
    })
}

resetPassword = function(userId,passwordBody){

  return new Promise((resolve,reject)=>{
       UserSchema.findById(userId,(err,user)=>{

            if(err)
                reject(err)

            
            if(user){
                if(passwordBody.old){
                    bcrypt.compare(passwordBody.old,user.password,(err,result)=>{
                        if(err)
                            reject(err)

                        if(result){
                            bcrypt.hash(passwordBody.new,saltRounds,(err,hash)=>{
                                if(err)
                                    reject(err)
                                    
                                UserSchema.findByIdAndUpdate(userId,{password:hash},(err,user)=>{
                                    if(err)
                                        reject(err)

                                    resolve(user)

                                })
                            });
                        }
                        else{
                            reject("Incorrect Old Password")
                        }
                    })
                }
                else{

                    bcrypt.hash(passwordBody.new,saltRounds,(err,hash)=>{
                        if(err)
                            reject(err)
                            
                        UserSchema.findByIdAndUpdate(userId,{password:hash},(err,user)=>{
                            if(err)
                                reject(err)

                            resolve(user)

                        })
                    });
                }
            }
        })
    })    
}

forgotPassword = function(userInfo){

   return new Promise((resolve,reject)=>{

        if(userInfo.email){
            console.log(userInfo)
            console.log(userInfo.email)
            UserSchema.findOne({email:userInfo.email},(err,user)=>{
                if(err)
                    reject(err)
                if(user)
                {
                    sendEmail(userInfo.email,user._id).then((data)=>{ 
                        console.log("suc")
                        resolve(data)
                    })
                    .catch((err)=>{
                        console.log(err)
                        reject(err)
                        })
                }
                else{
                    reject("This email is not registered with us. Please provide a valid email.")
                }

            })
        }
        else{
            UserSchema.findOne({phoneNumber:userInfo.phoneNumber},(err,user)=>{
                if(err)
                    reject(err)

                if(user){
                    if(user.email)
                    {
                        sendEmail(user.email,user._id).then((data)=>(resolve(data))).catch((err)=>reject(err))
                    }
                    else{
                        reject("Update your profile with email")
                    }
                }
                else{
                    reject("This phone number is not registered with us. Please provide a valid phone number.")
                }
            })
        }
    })

}

sendEmail = function(email,userId){
    return new Promise((resolve,reject)=>{
        transport = nodemailer.createTransport({
            host: process.env.emailHost,
            port: process.env.emailPort,
            secure:true,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailPassword
            }
        })

        const message = {
            from: process.env.emailUser, 
            to: email,        
            subject: 'Reset Password', 
            html: '<h4><b>Reset Password</b></h4>' +
            '<p>To reset your password, complete this form:</p>' +
            '<a href=' + config.clientUrl + 'reset/' + userId +'">Reset Password</a>' +
            '<br><br>' +
            '<p>--Team</p>' // Plain text body
        };

    
        transport.sendMail(message, function(err, info) {
            if (err) {
                console.log(err)
                reject(err)

            } else {
            console.log("aa")
            resolve("email send successfully")
            }
        });
  })  
}       

getAllUsers = function(){

    return new Promise((resolve,reject)=>{

        UserSchema.find((err,users)=>{
            if(err)
                reject(err)

            if(users && users.length>0)
            {             
                  
               let modifiedArray =  users.map(x=>{                
                   
                    return {
                        location :x["state"]["name"] ? (x["state"]["name"] +", " +x["city"]["name"]) : x["state"]["name"],
                        name:x["name"],
                        email:x["email"],
                        phoneNumber:x["phoneNumber"],
                        dob:x["dob"]
                        }
                })
               
                resolve(modifiedArray)
            }
            else
                reject("No User found")
        }).sort({ name : 1})

    })

}



module.exports = {
    signupUser,
    loginUser,
    getUserProfile,
    saveUserProfile,
    resetPassword,
    forgotPassword,
    getAllUsers
}