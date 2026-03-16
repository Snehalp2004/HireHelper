import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  otpForm: FormGroup;
  errorMsg = '';
  successMsg = '';
  isLoading = false;
  showOtpForm = false;

  // Forgot Password - Step 1
  showForgotPassword = false;
  resetEmail = '';
  forgotMsg = '';
  forgotError = false;

  // Forgot Password - Step 2
  showResetForm = false;
  resetOtp = '';
  resetNewPassword = '';
  resetConfirmPassword = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email_id: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  get resetPasswordMismatch(): boolean {
    if (!this.resetNewPassword && !this.resetConfirmPassword) return false;
    return this.resetNewPassword !== this.resetConfirmPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMsg = '';
      this.successMsg = '';
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = err.error?.msg || 'Login failed. Please check your credentials.';
          if (err.status === 403 || this.errorMsg.toLowerCase().includes('verify')) {
            this.showOtpForm = true;
          }
        }
      });
    }
  }

  onVerifyOtp() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.errorMsg = '';
      this.successMsg = '';
      const email = this.loginForm.get('email_id')?.value;
      const otp = this.otpForm.get('otp')?.value;

      this.authService.verifyOtp(email, otp).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMsg = 'Verification successful! Logging you in...';
          this.showOtpForm = false;
          setTimeout(() => this.onSubmit(), 1000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = err.error?.msg || 'OTP Verification failed.';
        }
      });
    }
  }

  onForgotPassword() {
    if (!this.resetEmail) return;
    this.isLoading = true;
    this.forgotMsg = '';
    this.forgotError = false;

    this.http.post(`${environment.apiUrl}/api/auth/forgot-password`, { email_id: this.resetEmail }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.forgotMsg = res?.msg || 'OTP sent to your email!';
        this.forgotError = false;
        // Move to step 2 after success
        setTimeout(() => {
          this.showResetForm = true;
          this.forgotMsg = '';
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.forgotMsg = err?.error?.msg || 'Failed to send reset email.';
        this.forgotError = true;
      }
    });
  }

  onResetPassword() {
    if (this.resetPasswordMismatch) return;
    this.isLoading = true;
    this.forgotMsg = '';
    this.forgotError = false;

    this.http.post(`${environment.apiUrl}/api/auth/reset-password`, {
      email_id: this.resetEmail,
      otp: this.resetOtp,
      new_password: this.resetNewPassword,
      confirm_password: this.resetConfirmPassword
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.forgotMsg = res?.msg || 'Password reset successfully!';
        this.forgotError = false;
        // Go back to login after success
        setTimeout(() => {
          this.showResetForm = false;
          this.showForgotPassword = false;
          this.resetEmail = '';
          this.resetOtp = '';
          this.resetNewPassword = '';
          this.resetConfirmPassword = '';
          this.forgotMsg = '';
          this.successMsg = 'Password reset successfully! You can now login.';
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.forgotMsg = err?.error?.msg || 'Failed to reset password.';
        this.forgotError = true;
      }
    });
  }
}
