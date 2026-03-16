import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginData = {
    email_id: '',
    password: ''
  };

  message = '';
  isSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router   // ✅ Inject Router
  ) {}

  login() {
    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);

        this.message = "Login successful!";
        this.isSuccess = true;

        // ✅ Redirect to dashboard after 1 second
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (err) => {
        this.message = err.error?.message || "Login failed";
        this.isSuccess = false;
      }
    });
  }
}