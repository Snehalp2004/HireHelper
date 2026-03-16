import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {

  @ViewChild('otpInput') otpInput!: ElementRef;

  email_id: string = '';
  otp: string = '';
  otpArray = new Array(6);

  message = '';
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email_id = params['email'] || '';
    });
  }

  onOtpChange() {
    // Allow only numbers
    this.otp = this.otp.replace(/[^0-9]/g, '');
  }

  focusInput() {
    const input = document.querySelector('.real-otp-input') as HTMLElement;
    input?.focus();
  }

  verify() {
    if (this.otp.length !== 6) {
      this.message = "Please enter complete 6-digit OTP";
      this.isSuccess = false;
      return;
    }

    this.authService.verifyOTP({
      email_id: this.email_id,
      otp: this.otp
    }).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.isSuccess = true;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.message = err.error?.message || "Verification failed";
        this.isSuccess = false;
      }
    });
  }
}