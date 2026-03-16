import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  profile: any = {};
  selectedFile: File | null = null;

  passwordData = {
    currentPassword: '',
    newPassword: ''
  };

  constructor(private service: TaskService) {}

  ngOnInit() {
    this.loadProfile();
  }

  /* ================= LOAD PROFILE ================= */

  loadProfile() {

    this.service.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res;
      },
      error: () => {
        Swal.fire("Error", "Failed to load profile", "error");
      }
    });

  }

  /* ================= FILE CHANGE ================= */

  onFileChange(event: any) {

    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }

  }

  /* ================= SAVE PROFILE ================= */

  saveProfile() {

    const formData = new FormData();

    formData.append('first_name', this.profile.first_name || '');
    formData.append('last_name', this.profile.last_name || '');
    formData.append('phone_number', this.profile.phone_number || '');
    formData.append('bio', this.profile.bio || '');

    if (this.selectedFile) {
      formData.append('profile_picture', this.selectedFile);
    }

    this.service.updateProfile(formData).subscribe({

      next: () => {

        Swal.fire(
          "Success",
          "Profile updated successfully",
          "success"
        );

        this.selectedFile = null;
        this.loadProfile(); // refresh profile

      },

      error: () => {

        Swal.fire(
          "Error",
          "Profile update failed",
          "error"
        );

      }

    });

  }

  /* ================= CHANGE PASSWORD ================= */

  changePassword() {

    this.service.changePassword(this.passwordData).subscribe({

      next: () => {

        Swal.fire(
          "Success",
          "Password changed successfully",
          "success"
        );

        this.passwordData = {
          currentPassword: '',
          newPassword: ''
        };

      },

      error: (err) => {

        Swal.fire(
          "Error",
          err.error.message || "Password change failed",
          "error"
        );

      }

    });

  }

  /* ================= REMOVE PROFILE PICTURE ================= */

  removeProfilePicture() {

    Swal.fire({
      title: "Are you sure?",
      text: "Your profile picture will be removed",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it"
    }).then((result) => {

      if (result.isConfirmed) {

        this.service.removeProfilePicture().subscribe({

          next: () => {

            this.profile.profile_picture = null;
            this.selectedFile = null;

            Swal.fire(
              "Removed",
              "Profile picture removed successfully",
              "success"
            );

          },

          error: () => {

            Swal.fire(
              "Error",
              "Failed to remove profile picture",
              "error"
            );

          }

        });

      }

    });

  }

}