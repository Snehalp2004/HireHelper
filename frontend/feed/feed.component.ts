import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';

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

  constructor(private service: TaskService) {}

  ngOnInit() {

    this.service.getFeedTasks().subscribe({

      next: (res: any[]) => {
        this.tasks = res;
        this.loading = false;
      },

      error: (err: any) => {
        console.error(err);
        this.errorMessage = "Failed to load tasks. Please try again.";
        this.loading = false;
      }

    });

  }

  requestTask(task: any) {

    console.log("Request clicked for task:", task);

    alert("Request button clicked for: " + task.title);

  }

}