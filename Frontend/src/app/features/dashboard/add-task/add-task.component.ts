import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { LanguageService } from '../../../core/services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;
  msg = '';
  isError = false;
  isLoading = false;
  minDateTime: string = '';
  labels: any = {};

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private langService: LanguageService
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.langService.lang$.subscribe(() => {
      this.labels = this.langService.getLabels();
    });

    const now = new Date();
    // Adjust for local timezone
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTime = now.toISOString().slice(0, 16);

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: [''],
      pay_amount: [''],
      pay_currency: ['rs'],
      pay_type: ['/ hr'],
      picture: ['']
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.msg = 'Please fill out all required fields.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.msg = '';
    this.isError = false;

    const formVal = { ...this.taskForm.value };
    if (formVal.pay_amount) {
      formVal.pay = `${formVal.pay_amount} ${formVal.pay_currency} ${formVal.pay_type}`.replace(/\s+/g, ' ').trim();
    } else {
      formVal.pay = '';
    }
    
    // cleanup
    delete formVal.pay_amount;
    delete formVal.pay_currency;
    delete formVal.pay_type;

    this.taskService.addTask(formVal).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard/my-tasks']);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.msg = err.error?.msg || 'Failed to add task';
      }
    });
  }
}
