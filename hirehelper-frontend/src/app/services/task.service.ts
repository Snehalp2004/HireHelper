import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Task {
    id?: string;
    user_id?: string;
    title: string;
    description?: string;
    location: string;
    start_time: string;
    end_time?: string;
    picture_url?: string;
    status?: string;
    created_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = `${environment.apiUrl}/tasks`;

    constructor(private http: HttpClient) { }

    createTask(task: Task): Observable<any> {
        return this.http.post(this.apiUrl, task);
    }

    getMyTasks(): Observable<{ tasks: Task[] }> {
        return this.http.get<{ tasks: Task[] }>(`${this.apiUrl}/my`);
    }

    getFeedTasks(): Observable<{ tasks: Task[] }> {
        return this.http.get<{ tasks: Task[] }>(this.apiUrl);
    }
}
