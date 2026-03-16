import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests: any[] = [];
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
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.isLoading = true;
    this.taskService.getIncomingRequests().subscribe({
      next: (data) => {
        this.requests = data.map((req: any) => {
          let conversation = [];
          if (req.reply_message) {
            try {
              conversation = JSON.parse(req.reply_message);
            } catch (e) {
              conversation = [{ sender: 'System', text: req.reply_message }];
            }
          }
          return { ...req, conversation };
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Failed to load help offers.';
        this.isLoading = false;
      }
    });
  }

  acceptRequest(requestId: string): void {
    this.taskService.updateRequestStatus(requestId, 'accepted').subscribe({
      next: () => this.fetchRequests(),
      error: (err) => alert(err?.error?.msg || 'Failed to accept request.')
    });
  }

  rejectRequest(requestId: string): void {
    this.taskService.updateRequestStatus(requestId, 'rejected').subscribe({
      next: () => this.fetchRequests(),
      error: (err) => alert(err?.error?.msg || 'Failed to reject request.')
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
      next: () => {
        alert('Reply sent successfully!');
        this.replyingRequestId = null;
        this.replyMessage = '';
        this.fetchRequests(); // Automatically load the new conversation thread
      },
      error: (err: any) => {
        alert(err?.error?.msg || 'Failed to send reply');
      }
    });
  }
}
