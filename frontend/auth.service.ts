import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(userData: any) {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(loginData: any) {
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  verifyOTP(data: any) {
    return this.http.post(`${this.baseUrl}/verify`, data);
  }
  getProfile() {
  return this.http.get('http://localhost:5000/api/users/me');
}
}