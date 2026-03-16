import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  formData = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {

    if(!this.formData.name || !this.formData.email || !this.formData.password){
      alert("Please fill all fields");
      return;
    }

    this.authService.register(this.formData).subscribe({
      next: () => {
        alert("Account created successfully!");
        this.router.navigate(['/login']);
      },
      error: () => {
        alert("Registration failed");
      }
    });

  }

}