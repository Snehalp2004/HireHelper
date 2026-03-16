import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  pay?: string;
  picture?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) { }

  addTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, taskData);
  }

  getMyTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/my`);
  }

  getFeedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}`);
  }

  requestTask(task_id: string, message: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, { task_id, message });
  }

  getIncomingRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incoming-requests`);
  }

  getMyAppliedTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-applied`);
  }

  updateRequestStatus(request_id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/request/${request_id}`, { status });
  }

  replyToRequest(request_id: string, reply_message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request/${request_id}/reply`, { reply_message });
  }

  updateTask(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  toggleTaskStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}
