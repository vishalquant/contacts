import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/authguard.guard';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { UserModule } from './components/user/user.module'
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetComponent } from './components/reset/reset.component';

const routes: Routes = [

  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset/:id', component: ResetComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: '', //frontend/src/app/components/user.module.ts
  loadChildren:'./components/user/user.module#UserModule'
  , canActivate:[AuthGuard] }, 
  
  { path: '**', redirectTo: '', canActivate:[AuthGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
