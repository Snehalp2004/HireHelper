import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-verify-otp',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './verify-otp.html',
    styleUrl: './verify-otp.css',
})
export class VerifyOtp implements OnInit {
    protected email = '';
    protected otp = '';
    protected errorMessage = signal('');
    protected successMessage = signal('');
    protected isLoading = signal(false);
    protected resendCountdown = signal(60);
    private timer: any;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'] || '';
            if (!this.email) {
                this.errorMessage.set('No email found for verification. Please register or login again.');
            } else {
                this.startCountdown();
            }
        });
    }

    startCountdown() {
        this.resendCountdown.set(60);
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            if (this.resendCountdown() > 0) {
                this.resendCountdown.update(v => v - 1);
            } else {
                clearInterval(this.timer);
            }
        }, 1000);
    }

    resendOTP() {
        if (this.resendCountdown() > 0 || this.isLoading()) return;

        this.isLoading.set(true);
        this.errorMessage.set('');
        this.successMessage.set('');

        this.authService.resendOTP(this.email).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                this.successMessage.set(res.message || 'OTP resent successfully!');
                this.startCountdown();
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Failed to resend OTP. Please try again.');
            }
        });
    }

    onSubmit() {
        if (!this.otp || this.otp.length !== 6 || !/^\d{6}$/.test(this.otp)) {
            this.errorMessage.set('Please enter a valid 6-digit numeric OTP');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        this.authService.verifyOTP(this.email, this.otp).subscribe({
            next: (res) => {
                this.isLoading.set(false);
                this.successMessage.set(res.message || 'Email verified successfully! Redirecting to login...');
                setTimeout(() => this.router.navigate(['/login']), 3000);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Verification failed. Please check your OTP.');
            }
        });
    }
}
