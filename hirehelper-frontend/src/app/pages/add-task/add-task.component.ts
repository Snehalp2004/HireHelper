import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'app-add-task',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
    taskForm: FormGroup;
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private router: Router
    ) {
        this.taskForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(5)]],
            description: ['', [Validators.required]],
            location: ['', [Validators.required]],
            start_time: ['', [Validators.required]],
            end_time: [''],
            picture_url: ['']
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.taskForm.invalid) {
            this.markFormGroupTouched(this.taskForm);
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        this.taskService.createTask(this.taskForm.value).subscribe({
            next: (res) => {
                this.successMessage = 'Task created successfully! Redirecting...';
                this.router.navigate(['/dashboard/my-tasks']);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
            }
        });
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if ((control as any).controls) {
                this.markFormGroupTouched(control as any);
            }
        });
    }
}
