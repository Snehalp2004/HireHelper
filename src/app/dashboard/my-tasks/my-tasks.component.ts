import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  tasks: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // 1️⃣ Get JWT token from localStorage
    const token = localStorage.getItem('token'); 

    // 2️⃣ Send GET request with token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:5000/api/tasks/my', { headers })
      .subscribe({
        next: data => {
          this.tasks = data;
        },
        error: err => {
          console.error(err);
          alert("Error fetching tasks: " + err.message);
        }
      });
  }

}