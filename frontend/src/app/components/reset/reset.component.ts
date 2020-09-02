import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit,OnDestroy {

  resetForm: FormGroup
  errorMsg:string = ""
  successMsg:string = ""
  hide:boolean = true
  subscription:Subscription
  userId: any
  constructor(private fb:FormBuilder,
    private router:Router,
    private userService:UserService,
    private activeRoute:ActivatedRoute) { 

    this.subscription = new Subscription();
    this.initializeForm()
  }

  initializeForm(){
    this.resetForm = this.fb.group({    
      newpassword:['',[Validators.required,Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{3,10}$')]],
      confirmpassword:['',Validators.required]
    }, {validator: this.checkPasswords })
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('newpassword').value;
    let confirmPass = group.get('confirmpassword').value;

    return pass === confirmPass ? null : { notSame: true }     
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      if(params['id']) {
        this.userId = params["id"]
      }
    });
  }


  onSubmit(passwordBody){
    
    if(!this.resetForm.valid)
      return

     const resetSubscription =  this.userService.resetPassword(this.userId,"",passwordBody["newpassword"]).subscribe((data)=>{
        if(data && data["success"]){
          this.router.navigate(['/login'])
        }

      },(err)=>{
        this.errorMsg = err.error.message
      })

    this.subscription.add(resetSubscription)
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

  
}
