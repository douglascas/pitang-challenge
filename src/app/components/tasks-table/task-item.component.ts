import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { StatusEnum, Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
	selector: 'app-task-item',
	templateUrl: 'task-item.component.html',
	styleUrl: './task-item.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class TaskItemComponent implements OnInit {
	private _task!: Task;
	StatusEnum = StatusEnum; // usado no template
	isMobile: boolean = false;
	@Output() onItemDelete = new EventEmitter<Task>();

	constructor(
		private _taskService: TaskService,
		private _router: Router,
	) {
		if (typeof window !== 'undefined') {
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

	/**
	 * Controle de tamanho de tela para renderizar componentes responsivos.
	 */
	@HostListener('window:resize', ['$event'])
	onResize(): void {
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

	/**
	 * Redireciona para a rota de edição de tarefas.
	 */
	editItem(task: Task): void {
		const link = ['edit-task', task.id];
		this._router.navigate(link);
	}

	/**
	 * Remove a tarefa selecionada da lista de tarefas.
	 */
	deleteItem(task: Task): void {
		if (confirm(`Deseja excluir a tarefa ${task.title}?`)) {
			this._taskService.deleteTask(task.id).subscribe({
				next: () => this.onItemDelete.emit(task),
				error: (err: Error) => console.log(err),
			})
		}
	}
}