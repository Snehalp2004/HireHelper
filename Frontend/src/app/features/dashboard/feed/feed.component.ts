import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../../core/services/task.service';
import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';

export interface FeedTask extends Task {
  first_name?: string;
  last_name?: string;
  user_picture?: string;
  applied?: boolean;
}

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit {
  tasks: FeedTask[] = [];
  isLoading = true;
  errorMsg = '';
  apiUrl = environment.apiUrl;
  labels: any = {};
  selectedTaskForRequest: FeedTask | null = null;
  requestMessage: string = '';

  constructor(
    private taskService: TaskService,
    private langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.langService.lang$.subscribe(() => {
      this.labels = this.langService.getLabels();
    });
    this.fetchFeed();
  }

  fetchFeed(): void {
    this.isLoading = true;
    this.errorMsg = '';
    
    this.taskService.getFeedTasks().subscribe({
      next: (data: any) => {
        this.tasks = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load feed.';
        this.isLoading = false;
      }
    });
  }

  onRequestTask(task: FeedTask): void {
    if (!task.id) return;
    this.selectedTaskForRequest = task;
    this.requestMessage = '';
  }

  confirmRequest(): void {
    if (!this.selectedTaskForRequest?.id) return;
    this.taskService.requestTask(this.selectedTaskForRequest.id, this.requestMessage).subscribe({
      next: () => {
        alert('Your request to help has been sent!');
        this.selectedTaskForRequest = null;
        this.requestMessage = '';
      },
      error: (err) => {
        alert(err?.error?.msg || 'Failed to send request.');
        this.selectedTaskForRequest = null;
      }
    });
  }

  cancelRequest(): void {
    this.selectedTaskForRequest = null;
    this.requestMessage = '';
  }
}
