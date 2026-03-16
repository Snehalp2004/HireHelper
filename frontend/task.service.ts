import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'http://localhost:5000/api/tasks';
  private userUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  /* ---------- AUTH HEADERS ---------- */

  getHeaders() {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  /* ---------- ADD TASK ---------- */

  addTask(data: FormData) {
    return this.http.post(
      `${this.baseUrl}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  /* ---------- GET MY TASKS ---------- */

  getMyTasks() {
    return this.http.get(
      `${this.baseUrl}/my`,
      { headers: this.getHeaders() }
    );
  }

  /* ---------- CHANGE PASSWORD ---------- */

  changePassword(data: any) {
    return this.http.put(
      `${this.userUrl}/change-password`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getProfile() {
  return this.http.get(
    'http://localhost:5000/api/users/profile',
    { headers: this.getHeaders() }
  );
}

updateProfile(data:any) {
  return this.http.put(
    'http://localhost:5000/api/users/profile',
    data,
    { headers: this.getHeaders() }
  );
}
removeProfilePicture(){

  return this.http.put(
    'http://localhost:5000/api/users/remove-profile-picture',
    {},
    {
      headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      }
    }
  );

}
getFeedTasks() {
  return this.http.get<any[]>('http://localhost:5000/api/tasks');
}
}