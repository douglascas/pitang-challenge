import { Component, Input, OnInit } from '@angular/core';
import { StatusEnum, Task } from '../../domain/task';
import { TaskService } from '../../service/task.service';

@Component({
	selector: 'app-task-table',
	templateUrl: 'task-table.component.html'
})
export class TaskTableComponent implements OnInit {
	private _tasks: Task[] = [];
	private _tasksBackup: Task[] = [];
	sortOptions!: any[];
	sortKey!: string;
	sortField!: string;
	sortOrder!: number;

	constructor(private readonly _taskService: TaskService) { }

	ngOnInit() {
		this.sortOptions = [
			{ label: 'Todas', value: '' },
			{ label: 'Concluídas', value: StatusEnum.Completed },
			{ label: 'Em andamento', value: StatusEnum.InProgress },
			{ label: 'Pendentes', value: StatusEnum.Pending }
		];
	}

	get tasks(): Task[] {
		return this._tasks;
	}

	@Input()
	set tasks(tasks: Task[]) {
		this._tasks = tasks;

		if (!this._tasksBackup.length) {
			this._tasksBackup = tasks;
		}
	}

	/**
	 * Ao acionar o filtro, os itens em tela serão filtrados com base nos valores de Status.
	 * Visando otimização, não será feito nenhuma request e sim um controle local. 
	 */
	onSortChange($event: any): void {
		if ($event.value !== '') {
			this.tasks = this._tasksBackup.filter(_task => _task.status === $event.value);
			return;
		}

		this.tasks = this._tasksBackup;
	}

	deleteTaskFromList(task: Task): void {
		this.tasks = this.tasks.filter(_task => _task.id !== task.id)
	}
}

