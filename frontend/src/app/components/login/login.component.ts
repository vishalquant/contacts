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
      username:['',[Validators.required, Validators.pattern('^(?:\\d{10}|\\w+@\\w+\\.\\w{2,3})$')]],
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
  
        // On success
        if(data["success"])
        {    
          // Set local storage to maintain user session
          localStorage.setItem("user",JSON.stringify(data["data"]))
          // Route to dashboard on successful login
          this.router.navigate(['/home'])
        }
      }
    },(err)=>{      
      // In case of error show error message
      if(err.error){
        this.errorMsg = err.error.message;       
      }      
    })

    this.subscription.add(loginSubscription)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
