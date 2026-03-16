import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  userName = '';
  profilePic: string | null = null;
  apiUrl = environment.apiUrl;
  isProfileMenuOpen = false;
  isDarkMode = false;
  labels: any = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private langService: LanguageService
  ) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userName = user.first_name || 'User';
      this.profilePic = user.profile_picture || null;
    }
    
    this.authService.getMe().subscribe({
      next: (data: any) => {
        this.userName = data.first_name || 'User';
        this.profilePic = data.profile_picture || null;
        localStorage.setItem('user', JSON.stringify(data));
      },
      error: (err) => console.error('Failed to fetch user data', err)
    });

    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }

    this.langService.lang$.subscribe(() => {
      this.labels = this.langService.getLabels();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
