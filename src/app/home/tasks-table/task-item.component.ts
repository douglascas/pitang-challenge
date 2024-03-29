import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { StatusEnum, Task } from '../../domain/task';
import { TaskService } from '../../service/task.service';
import { Router } from '@angular/router';
import { HostListener } from "@angular/core";

@Component({
	selector: 'app-task-item',
	templateUrl: 'task-item.component.html',
	styleUrl: './task-item.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class TaskItemComponent implements OnInit {
	private _task!: Task;
	StatusEnum = StatusEnum;

	isMobile: boolean = false;
	showActions: boolean = false;

	@Output() onItemDelete = new EventEmitter<Task>();

	constructor(
		private _taskService: TaskService,
		private _router: Router,
	) {
		if (typeof window !== 'undefined') {
			console.log(window.innerWidth);
			this.isMobile = window.innerWidth <= 768;
		}

	}

	ngOnInit() { }

	get task(): Task {
		return this._task;
	}

	@Input()
	set task(value: Task) {
		this._task = value;
	}

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.isMobile = window.innerWidth <= 768;
	}

	/**
	 * Método só funciona para versão mobile, onde o card terá a ação de click redirecionando para a rota de edição/visualização.
	 */
	viewItem(task: Task): void {
		if (this.isMobile) {
			this.editItem(task);
		}
	}

	editItem(task: Task): void {
		const link = ['edit-task', task.id];
		this._router.navigate(link);
	}

	deleteItem(task: Task): void {
		if (confirm(`Deseja excluir a tarefa ${task.title}?`)) {
			this._taskService.deleteTask(task.id).subscribe({
				next: () => this.onItemDelete.emit(task),
				error: (err: Error) => console.log(err),
			})
		}
	}

}