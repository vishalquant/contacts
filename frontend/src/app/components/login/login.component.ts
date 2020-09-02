import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  // Defining variables required 
  loginForm: FormGroup
  submitted:boolean = false
  errorMsg:string = ""
  subscription:  Subscription
  constructor(private fb:FormBuilder,
    private router:Router,
    private userService:UserService) { 

    this.subscription = new Subscription();
    // Initializing Form controls
    this.initializeForm()

    }

  ngOnInit(): void {
  }

  // defining controls required in this 
  // login form with the validators
  initializeForm(){
    this.loginForm = this.fb.group({
      username:['',[Validators.required, Validators.pattern('^(?:\\d{10}|[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4}))$')]],
      password:['',Validators.required]
    })
  }

  // Submit user form to login in case all the validation are a SUCCESS
  onSubmit(user){
    this.submitted = true
   
    
    // In case of form is not valid, return
    if(this.loginForm.invalid){    
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
   
  const loginSubscription =  this.userService.loginUser(user).subscribe((data)=>{
    if(data){
        this.errorMsg = ""
  
       
        if(data["success"])
        {    
          
          localStorage.setItem("user",JSON.stringify(data["data"]))
          
          this.router.navigate(['/home'])
        }
      }
    },(err)=>{      
      
      if(err.error){
        this.errorMsg = err.error.message;       
      }      
    })  

    this.subscription.add(loginSubscription)
  }

  routeToForgotPassword(){   
    this.router.navigate(['forgotpassword'])
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
