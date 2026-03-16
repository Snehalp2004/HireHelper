import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.html',
  styleUrls: ['./verify.css']
})
export class VerifyComponent {

  email = '';
  otp = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  verifyAccount() {

    this.http.post<any>('http://localhost:5000/api/auth/verify-otp', {
      email: this.email,
      otp: this.otp
    })
    .subscribe({

      next: (res) => {
        this.message = "Account verified successfully";
        alert("Account verified successfully");

        this.router.navigate(['/login']);
      },

      error: (err) => {
        this.message = err.error.message;
      }

    });

  }
  resendOtp() {
  this.http.post<any>('http://localhost:5000/api/auth/resend-otp', {
    email: this.email
  }).subscribe({

    next:(res)=>{
      alert("New OTP sent to your email");
    },

    error:(err)=>{
      this.message = err.error.message;
    }

  });

}

}