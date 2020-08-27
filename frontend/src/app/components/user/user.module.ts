import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {   MatToolbarModule } from '@angular/material/toolbar'
import {   MatMenuModule } from '@angular/material/menu'
import {   MatIconModule } from '@angular/material/icon'
import {   MatButtonModule } from '@angular/material/button'
import {   MatTableModule } from '@angular/material/table'
import {   MatDividerModule } from '@angular/material/divider'
import {   MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import {   MatInputModule } from '@angular/material/input'
import {   MatCardModule } from '@angular/material/card'
import {   MatSlideToggleModule } from '@angular/material/slide-toggle'
import {   MatSelectModule } from '@angular/material/select';
import {   MatDatepickerModule } from '@angular/material/datepicker';
import {   MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { ResetPasswordComponent } from './reset-password/reset-password.component'
// import { MatMomentDateModule } from '@angular/material-moment-adapter'
@NgModule({
  declarations: [HomeComponent, ProfileComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    UserRoutingModule,    
    FormsModule,
    ReactiveFormsModule,    
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    //MatOptionModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ]
})
export class UserModule { }
