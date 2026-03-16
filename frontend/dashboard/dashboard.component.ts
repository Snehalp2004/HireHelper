import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any = {};
  profileImage: string = 'assets/profile.png';

  pageTitle: string = "Feed";
  pageSubtitle: string = "Find tasks that need help";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadUserProfile();
    this.detectRouteTitle();

  }

  loadUserProfile() {

    this.authService.getProfile().subscribe({

      next: (res: any) => {

        this.user = res;

        if (res.profile_picture && res.profile_picture !== '') {
          this.profileImage = 'http://localhost:5000' + res.profile_picture;
        }

      },

      error: (err) => {
        console.error('Profile load error', err);
        this.logout();
      }

    });

  }

  detectRouteTitle() {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const url = this.router.url;

        if(url.includes('feed')) {
          this.pageTitle = "Feed";
          this.pageSubtitle = "Find tasks that need help";
        }

        else if(url.includes('my-tasks')) {
          this.pageTitle = "My Tasks";
          this.pageSubtitle = "Tasks you have posted";
        }

        else if(url.includes('requests')) {
          this.pageTitle = "Requests";
          this.pageSubtitle = "People requesting help for your tasks";
        }

        else if(url.includes('my-requests')) {
          this.pageTitle = "My Requests";
          this.pageSubtitle = "Tasks you have requested to help with";
        }

        else if(url.includes('add-task')) {
          this.pageTitle = "Add Task";
          this.pageSubtitle = "Post a new task for helpers";
        }

        else if(url.includes('settings')) {
          this.pageTitle = "Settings";
          this.pageSubtitle = "Manage your account preferences";
        }

      });

  }

logout() {

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    position: 'center'
  }).then((result) => {

    if (result.isConfirmed) {

      localStorage.removeItem('token');

      Swal.fire({
        icon: 'success',
        title: 'Logged out successfully',
        showConfirmButton: false,
        timer: 1500
      });

      this.router.navigate(['/login']);
    }

  });

}

}