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
}
