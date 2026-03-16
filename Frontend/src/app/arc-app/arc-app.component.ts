import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Task { id: number; title: string; done: boolean; }

@Component({
  selector: 'app-arc',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './arc-app.component.html',
  styleUrls: ['./arc-app.component.css']
})
export class ArcAppComponent {
  userName = 'User';
  tasks: Task[] = [
    { id: 1, title: 'Review new requests', done: false },
    { id: 2, title: 'Follow up with candidate', done: false }
  ];
  newTask = '';

  addTask() {
    const t = this.newTask.trim();
    if (!t) return;
    this.tasks.unshift({ id: Date.now(), title: t, done: false });
    this.newTask = '';
  }

  toggle(task: Task) {
    task.done = !task.done;
  }

  remove(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }
}
