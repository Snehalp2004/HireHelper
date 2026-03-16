import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})

export class AddTaskComponent {

  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {

    this.taskForm = this.fb.group({
  title: ['', Validators.required],
  description: ['', Validators.required],
  location: ['', Validators.required],
  startTime: ['', Validators.required],
  endTime: [''],        // optional
  picture: [''],        // optional
  budget: ['', Validators.required] // ✅ must have comma before if not last
});

  }

  submitTask() {

  if (this.taskForm.invalid) {
    alert("Please fill required fields");
    return;
  }

  const token = localStorage.getItem('token'); 
  if (!token) {
    alert("You must log in first!");
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  this.http.post('http://localhost:5000/api/tasks', this.taskForm.value, { headers })
    .subscribe({
      next: () => {
        alert("Task Created");
        this.router.navigate(['/my-tasks']);
      },
      error: err => {
        console.error(err);
        alert("Error creating task: " + err.status + " " + err.statusText);
      }
    });
}

}