import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { StatusEnum, Task } from '../../models/task';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  sortField: any;
  sortOrder: any;
  tasks: Task[] = [];
  StatusEnum = StatusEnum;

  constructor(
    private readonly _taskService: TaskService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this._taskService.getTasks().subscribe(tasks => {
      tasks.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
      this.tasks = tasks;
    });
  }

  public redirectToCreateTask(): void {
    this._router.navigate(['/new-task']);
  }
}
