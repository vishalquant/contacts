import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit,OnDestroy {

  forgotPasswordForm:FormGroup
  errorMsg:string = ""
  successMsg:string = ""
  subscription:Subscription
  constructor(private fb:FormBuilder,
    private router:Router,
    private userService:UserService)
     {        
       this.subscription = new Subscription();
       this.initializeForm()
     }
  
    ngOnInit(): void {

    }

    initializeForm(){
      this.forgotPasswordForm = this.fb.group({
        username:['',[Validators.required, Validators.pattern('^(?:\\d{10}|[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4}))$')]]
    });

  }

  onSubmit(user){

    
    if(!this.forgotPasswordForm.valid)
      return
    let email="",phoneNumber=""
    
    if (user.username.match('^\\d{10}$')){
      phoneNumber = user.username 
    }
    else{
      email = user.username
    }
    const loginSubscription =  this.userService.forgotPassword(email,phoneNumber).subscribe((data)=>{
      if(data){
          this.errorMsg = ""
          this.successMsg = data["message"]
      }
    },(err)=>{
        this.errorMsg = err.error.message
        this.successMsg = ""
      })

      this.subscription.add(loginSubscription)
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}

