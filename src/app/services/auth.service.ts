import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthData {
  email?: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: AuthData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: AuthData): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }
}