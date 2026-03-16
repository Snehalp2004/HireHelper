import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule],   // ✅ IMPORTANT
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getMyTasks().subscribe({
      next: (res: any) => {
        this.tasks = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}