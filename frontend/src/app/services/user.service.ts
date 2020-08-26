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

  saveUserProfile(userId,user){
    return this.httpClient.post(this.SERVER_URL+"/user/profile/"+userId, user)
  }
}
