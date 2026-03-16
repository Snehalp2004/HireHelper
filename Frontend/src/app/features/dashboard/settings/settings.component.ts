import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  
  settings = {
    emailNotifications: true,
    pushNotifications: false,
    taskAlerts: true,
    darkMode: false,
    language: 'en'
  };

  isSaved = false;
  labels: any = {};

  constructor(
    private langService: LanguageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
    }
    const theme = localStorage.getItem('theme');
    this.settings.darkMode = theme === 'dark';
    this.labels = this.langService.getLabels();

    this.authService.getMe().subscribe(user => {
      this.settings.emailNotifications = user.email_notifications !== false; // defaults to true
    });
  }

  onLanguageChange() {
    this.langService.setLanguage(this.settings.language);
    this.labels = this.langService.getLabels();
  }

  toggleTheme() {
    if (this.settings.darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    this.langService.setLanguage(this.settings.language);
    
    if (this.settings.darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }

    this.authService.updateSettings({ email_notifications: this.settings.emailNotifications }).subscribe({
      next: () => {
        this.isSaved = true;
        setTimeout(() => { this.isSaved = false; }, 3000);
      },
      error: (err) => {
        console.error('Failed to update email notification setting', err);
        // still show visual success for local settings
        this.isSaved = true;
        setTimeout(() => { this.isSaved = false; }, 3000);
      }
    });
  }
}
