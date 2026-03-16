import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

  }

  login(){

    if(this.loginForm.invalid){
      alert("Enter valid credentials");
      return;
    }

    this.http.post('http://localhost:5000/api/auth/login', this.loginForm.value)
    .subscribe({
      next:(res:any)=>{
        localStorage.setItem('token',res.token);
        alert("Login successful");
        this.router.navigate(['/dashboard']);
      },
      error:()=>{
        alert("Invalid email or password");
        this.router.navigate(['/register']);
      }
    });

  }

}