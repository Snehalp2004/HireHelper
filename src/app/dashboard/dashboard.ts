import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [RouterModule, HttpClientModule]
})
export class Dashboard implements OnInit {
  userName = 'User';

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    const token = localStorage.getItem('token');
    console.log('Dashboard token:', token);

    if (!token) {
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:5000/api/users/me', { headers })
      .subscribe({
        next: (res) => {
          console.log('User profile response:', res);
          this.userName = res?.first_name ? res.first_name : 'User';
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
        }
      });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}