import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'frontend-app';

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    }
    
    // Also initialize language if stored
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings);
        if (settings.language) {
          // If we had the language service here we would set it, 
          // but LanguageService automatically reads from localStorage on its own initialization.
        }
      } catch (e) {}
    }
  }
}
