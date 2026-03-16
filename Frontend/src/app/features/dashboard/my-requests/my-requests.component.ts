import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  appliedTasks: any[] = [];
  isLoading = true;
  errorMsg = '';
  apiUrl = environment.apiUrl;
  labels: any = {};
  replyingRequestId: string | null = null;
  replyMessage: string = '';

  constructor(
    private taskService: TaskService,
    private langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.langService.lang$.subscribe(() => {
      this.labels = this.langService.getLabels();
    });
    this.fetchAppliedTasks();
  }

  fetchAppliedTasks(): void {
    this.isLoading = true;
    this.taskService.getMyAppliedTasks().subscribe({
      next: (data) => {
        this.appliedTasks = data.map((task: any) => {
          let conversation = [];
          if (task.reply_message) {
            try {
              conversation = JSON.parse(task.reply_message);
            } catch (e) {
              conversation = [{ sender: 'System', text: task.reply_message }];
            }
          }
          return { ...task, conversation };
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load applied tasks.';
        this.isLoading = false;
      }
    });
  }

  openReplyModal(requestId: string): void {
    this.replyingRequestId = requestId;
    this.replyMessage = '';
  }

  cancelReply(): void {
    this.replyingRequestId = null;
    this.replyMessage = '';
  }

  sendReply(): void {
    if (!this.replyingRequestId || !this.replyMessage.trim()) return;

    this.taskService.replyToRequest(this.replyingRequestId, this.replyMessage).subscribe({
      next: (res) => {
        alert('Reply sent successfully!');
        this.replyingRequestId = null;
        this.replyMessage = '';
        this.fetchAppliedTasks(); // Refresh to see the updated conversation
      },
      error: (err: any) => {
        alert(err?.error?.msg || 'Failed to send reply');
      }
    });
  }
}
