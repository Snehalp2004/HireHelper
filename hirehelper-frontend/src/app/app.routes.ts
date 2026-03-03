import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { VerifyOtp } from './pages/verify-otp/verify-otp';
import { authGuard } from './guards/auth.guard';
import { Overview } from './pages/dashboard/overview/overview';
import { Profile } from './pages/dashboard/profile/profile';


export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'verify-otp', component: VerifyOtp },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard],
        children: [
            { path: 'overview', component: Overview },
            { path: 'profile', component: Profile },

            { path: '', redirectTo: 'overview', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
