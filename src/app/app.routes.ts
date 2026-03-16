import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FeedComponent } from './dashboard/feed/feed.component';
import { MyTasksComponent } from './dashboard/my-tasks/my-tasks.component';
import { AddTaskComponent } from './dashboard/add-task/add-task.component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'feed', redirectTo: 'dashboard/feed' },
  { path: 'my-tasks', redirectTo: 'dashboard/my-tasks' },
  { path: 'add-task', redirectTo: 'dashboard/add-task' },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'feed', component: FeedComponent },
      { path: 'my-tasks', component: MyTasksComponent },
      { path: 'add-task', component: AddTaskComponent },
      { path: '', redirectTo: 'feed', pathMatch: 'full' }
    ]
  }

];