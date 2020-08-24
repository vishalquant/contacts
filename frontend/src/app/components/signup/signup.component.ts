import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  // Defining variables required 
  signupForm: FormGroup
  submitted:boolean = false
  errorMsg:string = ""
  constructor(private fb:FormBuilder,
    private router:Router,
    private userService:UserService) { 

    // Initializing Form controls
    this.initializeForm()

    }

  ngOnInit(): void {
  }

  // defining controls required in this 
  // login form with the validators
  initializeForm(){
    this.signupForm = this.fb.group({
      username:['',[Validators.required, Validators.pattern('^(?:\\d{10}|\\w+@\\w+\\.\\w{2,3})$')]],
      password:['',Validators.required]
    })
  }

  // Submit user form to login in case all the validation are a SUCCESS
  onSubmit(user){
    this.submitted = true
   
    
    // In case of form is not valid, return
    if(this.signupForm.invalid){    
      return
    }

    if(user){
     if (isNaN(user.username)){
        user["email"] = user.username
      }
      else{
        user["phoneNumber"] = user.username
      }
    }
    console.log(user)
    this.userService.signupUser(user).subscribe((data)=>{
    if(data){
        this.errorMsg = ""
  
        // On success
        if(data["success"])
        {    
          // Set local storage to maintain user session
          localStorage.setItem("user",JSON.stringify(data["data"]))
          // Route to dashboard on successful login
          this.router.navigate(['/'])
        }
      }
    },(err)=>{      
      // In case of error show error message
      if(err.error){
        this.errorMsg = err.error.message;       
      }      
    })
  }

}