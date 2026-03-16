import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tasks.html',
  styleUrls: ['./my-tasks.css']
})
export class MyTasksComponent implements OnInit {

  tasks: any[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:5000/api/tasks/my', { headers })
      .subscribe({
        next: (res) => {
          this.tasks = res.tasks;

          if (this.tasks.length === 0) {
            this.message = 'No tasks created yet';
          }
        },
        error: (err) => {
          console.error(err);
          this.message = 'Error loading tasks';
        }
      });
  }
}