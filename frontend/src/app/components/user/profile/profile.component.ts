import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../helpers/format-datepicker';
import csc from 'country-state-city'
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {

  profileForm: FormGroup
  user:any
  submitted:boolean = false
  errorMsg:string = ""
  successMsg:string = ""
  states:any = []
  cities:any = []
  userId:any = ""
  subscription: Subscription
  constructor(private fb:FormBuilder,
    private router:Router,
    private userService:UserService,
    private activeRoute: ActivatedRoute,
    private  dialog:  MatDialog) { 

    this.subscription = new Subscription();
    // Initializing Form controls
    this.initializeForm()
     
    }

  ngOnInit(): void {
    this.states = csc.getStatesOfCountry("101") // For India

    this.activeRoute.params.subscribe(params => {
      if(params['id']) {
        this.userId = params["id"]
        console.log("a")
         let profileSubscription = this.userService.getUserProfile(params['id']).subscribe((data)=>{
            console.log(data)
            if(data && data["success"])
            {
              this.getCities(data["data"]["state"])
              this.profileForm.patchValue(data["data"])
              this.user = data["data"]
            }
            else{
              this.errorMsg = "Could not load user profile"
            }
         });

         this.subscription.add(profileSubscription)
      }
    });
  }

  // defining controls required in this 
  // login form with the validators
  initializeForm(){

    this.profileForm = this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      phoneNumber:['',[Validators.required,Validators.pattern('^(?:\\d{10})$')]],
      dob:[new FormControl(new Date()), Validators.required],
      state:['',Validators.required],
      city:['',Validators.required]
    })
  }

  getCities(state){
   this.cities = csc.getCitiesOfState(state)
  }

  onSubmit(profile){
   

   const saveProfileSubscription =  this.userService.saveUserProfile(this.userId,profile).subscribe((user)=>{
      if(user && user["success"])  {    
        this.profileForm.patchValue(user["data"])
        this.user = user["data"]

        this.errorMsg = ""
        this.successMsg = "Profile saved successfully."

      }
      else{
        this.errorMsg = "Could not save profile"
        this.successMsg = ""
      }
    },(err)=>{
      this.errorMsg = err.error.message;
      
      this.successMsg = ""
    })

    this.subscription.add(saveProfileSubscription)


  }

  onForgotPassword(){
    this.dialog.open(ResetPasswordComponent,{data:this.user})
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
