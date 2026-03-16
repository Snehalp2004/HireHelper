import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  tasks: any[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:5000/api/tasks', { headers })
      .subscribe({
        next: (data) => {
          console.log("Tasks:", data);
          this.tasks = data;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = "Failed to load tasks";
          this.loading = false;
        }
      });
  }

  sendRequest(taskId: number) {
    alert("Request sent for task " + taskId);
  }

}