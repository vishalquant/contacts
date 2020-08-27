const express = require('express');
const router = express.Router();
const userService = require('../services/userservice');
const userservice = require('../services/userservice');

router.post('/signup',(req,res)=>{

  userService.signupUser(req.body).
  then((result)=>{

   // In case of success, send success msg with the data
    return res.json({
      success: true,
      message: "Thank you for signing up.",
      data: result,
    });
  })
  .catch((err) => {
    // In case of error, setting status code
    // with the error message      
    return res
      .status(400)
      .json({ success: false, message: err, data: null });
  });

})

router.post('/login',(req,res)=>{

  userService.loginUser(req.body).
  then((result)=>{

   // In case of success, send success msg with the data
    return res.json({
      success: true,
      message: "Sucessfully logged In",
      data: result,
    });
  })
  .catch((err) => {
    console.log(err)
    // In case of error, setting status code
    // with the error message      
    return res
      .status(400)
      .json({ success: false, message: err, data: null });
  });
});

  router.get('/profile/:id',(req,res)=>{

    userService.getUserProfile(req.params.id).
    then((result)=>{
  
     // In case of success, send success msg with the data
      return res.json({
        success: true,
        message: "User Profile Details",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err)
      // In case of error, setting status code
      // with the error message      
      return res
        .status(400)
        .json({ success: false, message: err, data: null });
    });

  });

  router.post('/profile/:id',(req,res)=>{

    userService.saveUserProfile(req.params.id,req.body).
    then((result)=>{
  
     // In case of success, send success msg with the data
      return res.json({
        success: true,
        message: "Profile saved successfully.",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err)
      // In case of error, setting status code
      // with the error message      
      return res
        .status(400)
        .json({ success: false, message: err, data: null });
    });

  });


router.patch('/profile/:id',(req,res)=>{

  userservice.resetPassword(req.params.id,req.body).then((result)=>{
  
    // In case of success, send success msg with the data
     return res.json({
       success: true,
       message: "Password has been successfully reset.",
       data: result,
     });
   })
   .catch((err) => {
     console.log(err)
     // In case of error, setting status code
     // with the error message      
     return res
       .status(400)
       .json({ success: false, message: err, data: null });
   });
});

module.exports = router;
