import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { FeedComponent } from './feed/feed.component';
import { authGuard } from './auth.guard';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [

{ path: '', redirectTo: 'login', pathMatch: 'full' },

{ path: 'login', component: LoginComponent },

{ path: 'register', component: RegisterComponent },

{ path: 'verify', component: VerifyOtpComponent },

{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard],

  children: [

    { path: 'feed', component: FeedComponent },

    { path: 'add-task', component: AddTaskComponent },

    { path: 'my-tasks', component: MyTasksComponent },
    
    {
  path:'settings',
  component:SettingsComponent
},
    

    { path: '', redirectTo: 'feed', pathMatch: 'full' }

  ]
}

];