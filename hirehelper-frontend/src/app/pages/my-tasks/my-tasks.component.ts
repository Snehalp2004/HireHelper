import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';

@Component({
    selector: 'app-my-tasks',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './my-tasks.component.html',
    styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
    tasks: Task[] = [];
    loading = true;
    errorMessage = '';

    constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.fetchTasks();
    }

    fetchTasks(): void {
        this.loading = true;
        this.taskService.getMyTasks().subscribe({
            next: (res) => {
                this.tasks = res.tasks || [];
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = 'Failed to load tasks. Please try again later.';
                console.error('Error fetching tasks:', err);
            }
        });
    }

    getStatusClass(status: string | undefined): string {
        switch (status?.toUpperCase()) {
            case 'OPEN': return 'bg-green-100 text-green-800 border-green-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }
}
