import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Profile</h2>

    <div *ngIf="user">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>

    <div *ngIf="error" style="color:red;">
      {{ error }}
    </div>
  `
})
export class ProfileComponent implements OnInit {

  user: any;
  error: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:5000/api/profile')
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          this.error = 'Failed to load profile';
        }
      });
  }
}