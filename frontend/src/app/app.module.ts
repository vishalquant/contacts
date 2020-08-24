import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
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
import { LoginComponent } from './components/login/login.component'
//import {   MatOptionModule} from '@angular/material/select'

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
    MatProgressSpinnerModule
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
