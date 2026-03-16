import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  email = '';
  password = '';
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private location: Location
  ) {}

  loginUser() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter email and password';
      return;
    }

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.token) {
          this.auth.saveToken(res.token);
          console.log('Token saved:', localStorage.getItem('token'));
        }
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Server Error';
      }
    });
  }

  goToVerify() {
    this.router.navigate(['/verify']);
  }

  goBack() {
    this.location.back();
  }
}