import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  SERVER_URL = environment.serverURL
  constructor(private httpClient:HttpClient) { }

  signupUser(user){
    return this.httpClient.post(this.SERVER_URL+"/user/signup", user)
  }

  loginUser(user){
    return this.httpClient.post(this.SERVER_URL+"/user/login", user)
  }

  getUserProfile(userId){
    return this.httpClient.get(this.SERVER_URL+"/user/profile/"+userId)
  }

  getAllUsers(){
    return this.httpClient.get(this.SERVER_URL+"/user")
  }

  saveUserProfile(userId,user){
    return this.httpClient.post(this.SERVER_URL+"/user/profile/"+userId, user)
  }

  resetPassword(userId,oldPassword,newPassword){
    return this.httpClient.patch(this.SERVER_URL+"/user/profile/"+userId, { old:oldPassword,new:newPassword })
  }

  forgotPassword(email,phoneNumber){
    return this.httpClient.post(this.SERVER_URL+"/user/forgotpassword",{ email:email,phoneNumber:phoneNumber })
  }
}
