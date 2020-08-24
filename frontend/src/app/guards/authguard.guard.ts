import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router:Router){ }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if (localStorage.getItem('user')) {
        // logged in so return true

        // let storageUser = JSON.parse(localStorage.getItem('user'))
        
        // if(storageUser.userType == "user" && next.url.toString()=='doctor'){
        //   this.router.navigate(['/user']);
        // }
        // if(storageUser.userType == "doctor" && next.url.toString()=='user'){
        //   this.router.navigate(['/doctor']);
        // }
        
        return true;
      }
      // in case user not signed up redirect to login
      this.router.navigate(['/login']);
  }



  
}
