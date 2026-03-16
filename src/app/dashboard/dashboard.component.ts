import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // needed for <router-outlet>

@Component({
  selector: 'app-dashboard',
  standalone: true,            // make it standalone since you're using bootstrapApplication
  imports: [CommonModule, RouterModule],  // <-- add RouterModule here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  activeMenu: string = 'Home';

  setActive(menu: string) {
    this.activeMenu = menu;
  }
}
