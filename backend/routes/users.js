const express = require('express');
const router = express.Router();
const userService = require('../services/userservice');
const dataService = require('../services/dataservice');
const loggerService = require('../services/loggerservice');

router.post('/signup',(req,res)=>{

  userService.signupUser(req.body).
    then((result)=>{
      return res.json(dataService.returnSuccess(result,"Thank you for signing up."));
    })
    .catch((err) => {
      loggerService.logError("signupUser", "users.js", req.url,err.error)
      return res
        .status(400)
        .json(dataService.returnFailure(err));
    });
})

router.post('/login',(req,res)=>{

  userService.loginUser(req.body).
    then((result)=>{
      return res.json(dataService.returnSuccess(result,"Sucessfully logged In"));
    })
    .catch((err) => {
      loggerService.logError("loginUser", "users.js", req.url,err.error)    
      return res
        .status(400)
        .json(dataService.returnFailure(err));
    });
});

  router.get('/profile/:id',(req,res)=>{

    userService.getUserProfile(req.params.id).
      then((result)=>{
        return res.json(dataService.returnSuccess(result,"User Profile Details"))
      })
      .catch((err) => {
        loggerService.logError("getUserProfile", "users.js", req.url,err.error)   
        return res
          .status(400)
          .json(dataService.returnFailure(err));
      });
  });

  router.post('/profile/:id',(req,res)=>{

    userService.saveUserProfile(req.params.id,req.body).
      then((result)=>{
        return res.json(dataService.returnSuccess(result,"Profile saved successfully."));
      })
      .catch((err) => {
        loggerService.logError("saveUserProfile", "users.js", req.url,err.error)     
        return res
          .status(400)
          .json(dataService.returnFailure(err));
      });
  });


router.patch('/profile/:id',(req,res)=>{

  userService.resetPassword(req.params.id,req.body).
    then((result)=>{
      return res.json(dataService.returnSuccess(result,"Password has been successfully reset."));
    })
    .catch((err) => {   
      loggerService.logError("resetPassword", "users.js", req.url,err.error)
      return res
        .status(400)
        .json(dataService.returnFailure(err));
    });
});

router.post('/forgotpassword',(req,res)=>{

  userService.forgotPassword(req.body).
    then((result)=>{
      return res.json(dataService.returnSuccess(result,"Email sent to your email Id."));
    })
    .catch((err) => {   
      loggerService.logError("forgotPassword", "users.js", req.url,err.error)
      return res
        .status(400)
        .json(dataService.returnFailure(err));
    });
})


router.get('/:id',(req,res)=>{

  userService.getAllUsers(req.params.id).
    then((result)=>{        
        return res.json(dataService.returnSuccess(result,"List of Users"))   
      })
      .catch((err) => {           
        loggerService.logError("getAllUsers", "users.js", req.url ,err.error)
        return res
          .status(400)
          .json(dataService.returnFailure(err));
      });
})

router.patch('/friends/:id',(req,res)=>{

  userService.addFriend(req.params.id,req.body).
    then((result)=>{     
      return res.json(dataService.returnSuccess(result,"Contact added successfully to your friend’s list."))
    })
    .catch((err) => {   
      loggerService.logError("addFriend", "users.js", req.url,err.error)
      return res
        .status(400)
        .json(dataService.returnFailure(err));
    });
});

router.get('/friends/:id',(req,res)=>{

  userService.getFriends(req.params.id,req.body).
    then((result)=>{     
      return res.json(dataService.returnSuccess(result,"Friend’s list."))
    })
    .catch((err) => {   
      loggerService.logError("getFriends", "users.js", req.url,err.error)
      return res
        .status(400)
        .json(dataService.returnFailure(err));
    });
});

module.exports = router;
