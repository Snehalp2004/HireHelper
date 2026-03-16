import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {

  selectedFile: File | null = null;

  task = {
    title: '',
    description: '',
    category: '',
    location: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: ''
  };

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitTask() {

    const formData = new FormData();

    const startDateTime =
      this.task.start_date + " " + this.task.start_time;

    const endDateTime =
      this.task.end_date && this.task.end_time
        ? this.task.end_date + " " + this.task.end_time
        : '';

    formData.append('title', this.task.title);
    formData.append('description', this.task.description);
    formData.append('category', this.task.category);
    formData.append('location', this.task.location);
    formData.append('start_time', startDateTime);
    formData.append('end_time', endDateTime);

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.taskService.addTask(formData).subscribe({

      next: () => {

        Swal.fire({
          icon: 'success',
          title: 'Task Created!',
          text: 'Your task has been posted successfully.',
          confirmButtonColor: '#2563eb'
        }).then(() => {
          this.router.navigate(['/dashboard/my-tasks']);
        });

      },

      error: () => {

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Task creation failed. Please try again.',
          confirmButtonColor: '#ef4444'
        });

      }

    });

  }

}