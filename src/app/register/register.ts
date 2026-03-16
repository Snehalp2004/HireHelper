import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  first_name = '';
  last_name = '';
  email = '';
  password = '';
  number = '';
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private location: Location
  ) {}

  registerUser() {
    if (!this.first_name || !this.last_name || !this.email || !this.password || !this.number) {
      this.errorMsg = 'All fields are required';
      return;
    }

    const user = {
      first_name: this.first_name.trim(),
      last_name: this.last_name.trim(),
      email: this.email.trim(),
      password: this.password,
      number: this.number.trim()
    };

    this.auth.register(user).subscribe({
      next: () => {
        this.errorMsg = '';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Server Error';
      }
    });
  }

  goBack() {
    this.location.back();
  }
}