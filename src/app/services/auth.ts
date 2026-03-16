import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';  // Backend URL

  constructor(private http: HttpClient) { }

  // Register API call
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  // Login API call
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Save JWT in localStorage
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Get JWT from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
  }

  // ✅ Protected route: get current user
  getProfile(): Observable<any> {
    // Interceptor will automatically attach the JWT
    return this.http.get('http://localhost:5000/api/users/me');
  }
}