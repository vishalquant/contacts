const express = require('express');
const router = express.Router();
const userService = require('../services/userservice')

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

})



module.exports = router;
