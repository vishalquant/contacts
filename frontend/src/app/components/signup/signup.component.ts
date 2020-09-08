import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  // Defining variables required
  signupForm: FormGroup;
  submitted: boolean;
  errorMsg: string;
  subscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.subscription = new Subscription();
    // Initializing Form controls
    this.initializeForm();
  }

  ngOnInit(): void {}

  // defining controls required in this
  // signup form with the validators
  initializeForm(): void {
    this.signupForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?:\\d{10}|[_a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4}))$'
          ),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  // Submit user form in case all the validation are a SUCCESS
  onSubmit(user): void {
    this.submitted = true;

    // In case of form is not valid, return
    if (this.signupForm.invalid) {
      return;
    }

    if (user) {
      if (isNaN(user.username)) {
        user.email = user.username;
      } else {
        user.phoneNumber = user.username;
      }
    }

    const signupSubsription = this.userService.signupUser(user).subscribe(
      (data) => {
        if (data) {
          this.errorMsg = '';

          // On success
          if (data['success']) {
            // Set local storage to maintain user session
            localStorage.setItem('user', JSON.stringify(data['data']));
            // Route to dashboard on successful login
            this.router.navigate(['/']);
          }
        }
      },
      (err) => {
        // In case of error show error message
        if (err.error) {
          this.errorMsg = err.error.message;
        }
      }
    );

    this.subscription.add(signupSubsription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
