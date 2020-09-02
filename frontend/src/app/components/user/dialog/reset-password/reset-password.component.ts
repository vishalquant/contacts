import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup
  errorMsg:string = ""
  successMsg:string = ""
  hide:boolean = true
  subscription:Subscription

  
  constructor(private fb:FormBuilder,
    private router:Router,
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

      this.subscription = new Subscription();
      this.initializeForm()
console.log(this.data)
    }

  ngOnInit(): void {
  }


  initializeForm(){
    this.resetPasswordForm = this.fb.group({
      oldpassword:['',Validators.required],
      newpassword:['',[Validators.required,Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{3,10}$')]],
      confirmpassword:['',Validators.required]
    }, {validator: this.checkPasswords })
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('newpassword').value;
    let confirmPass = group.get('confirmpassword').value;

    return pass === confirmPass ? null : { notSame: true }     
  }

  onSubmit(resetForm){

     // In case of form is not valid, return
    if(this.resetPasswordForm.invalid){    
      return
    }
    if(this.data){
        
    const resetSubscription =   this.userService.resetPassword(this.data._id,resetForm["oldpassword"],resetForm["newpassword"]).subscribe((data)=>{
        if(data && data["success"])
        { 
          this.errorMsg = ""
          this.successMsg = data["message"]
        }
      },(err)=>{
        this.errorMsg = err.error.message
        this.successMsg = ""
    })

    this.subscription.add(resetSubscription)

    }

  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
