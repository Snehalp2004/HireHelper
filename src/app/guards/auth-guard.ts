import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.auth.getToken();
    if (token) {
      return true; // Token present → allow route
    } else {
      this.router.navigate(['/login']); // Token missing → redirect to login
      return false;
    }
  }
}