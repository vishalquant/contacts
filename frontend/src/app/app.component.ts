import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'My Contacts App';
  // isAuthenticated: boolean = false

  constructor(private router: Router) {
    console.log('cons');
  }

  get isAuthenticated(): boolean {
    return localStorage.getItem('user') ? true : false;
  }

  ngOnInit() {
    // if(localStorage.getItem("user")){
    //   this.isAuthenticated = true
    // }else{
    //   this.isAuthenticated = false
    // }
    // console.log("app")
  }

  onLogOut(): void {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      //   this.isAuthenticated = false
      this.router.navigate(['/login']);
    }
  }

  onProfileClick() {
    console.log('s');
    if (localStorage.getItem('user')) {
      let user = JSON.parse(localStorage.getItem('user'));
      this.router.navigate(['/profile/' + user._id]);
    }
  }
}
