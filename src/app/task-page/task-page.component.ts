import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { StatusEnum, Task } from '../domain/task';
import { TaskService } from '../service/task.service';

@Component({
	selector: 'app-task',
	templateUrl: 'task-page.component.html',
	styleUrls: ['task.page.component.scss']
})

export class TaskPageComponent implements OnInit {
	task: Task = new Task();
	maxDate = new Date();
	taskForm!: FormGroup;
	isEditMode = false;
	StatusEnum = StatusEnum;

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _formBuilder: FormBuilder,
		private _taskService: TaskService
	) {
		this._route.params.subscribe(params => {
			const id = params['id'];
			this.isEditMode = !!id;
		});

		this.taskForm = this._formBuilder.group({
			id: [''],
			title: ['', [Validators.required, Validators.minLength(5)]],
			description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
			status: [''],
			created: [''],
			completionDate: [''],
			finished: ['']
		});
	}

	ngOnInit() {
		if (this.isEditMode) {
			this.getTaskById();
		}
	}

	/**
	 * Obtém as informações da tarefa e preenche o formulário.
	 * Caso a tarefa tenha sido finalizada, será possível somente a visualização.
	 */
	getTaskById(): void {
		this._route.params.pipe(
			switchMap(params => this._taskService.getTaskById(params['id']))
		).subscribe({
			next: (task) => {
				task.created = new Date(task.created);
				task.completionDate = new Date(task.completionDate);
				this.task = task;

				console.log(task);
				this.taskForm.patchValue(task);

				if (task.status === StatusEnum.Completed) {
					this.taskForm.disable();
				}
			},
			error: (err: Error) => console.log(err),
		});
	}

	/**
	 * Caso a tarefa já tenha sido finalizada, o alerta para prevenir voltar sem salvar é desabitado.
	 */
	goBack(): void {
		if (this.isFinishedTask()) {
			this._router.navigate(['/']);
			return;
		}

		if (confirm('Ao voltar, a informação alterada não será salva. Deseja continuar?')) {
			this._router.navigate(['/']);
		}
	}

	/**
	 * Método chamado pelo html para salvar a tarefa.
	 * Caso ela tenha um `id`, será chamado o método `updateTask()`.
	 * Caso não, é entendido que é uma nova atividade, chamando o `createTask()`.
	 */
	save(): void {
		if (this.taskForm.valid) {
			if (this.task.id) {
				this.updateTask();
				return;
			}

			this.createTask();
		}
	}

	/**
	 * Cria uma tarefa com os valores informados no formulário.
	 */
	createTask(): void {
		this._taskService.addTask(this.taskForm.value as Task).subscribe({
			next: () => this._router.navigate(['']),
			error: (err: Error) => console.error('Erro ao criar nova tarefa:', err),
		})
	}

	/**
	 * Atualiza a tarefa com os valores atuais do formulário.
	 */
	updateTask(): void {
		this._taskService.updateTask(this.taskForm.value as Task).subscribe({
			next: () => this._router.navigate(['']),
			error: (err: Error) => console.error('Erro ao editar tarefa:', err),
		})
	}

	/**
	 * Caso seja uma tarefa nova, a aplicação irá apenas redirecionar para a home após a confirmação.
	 * Caso seja uma tarefa já registrada, será apagada no db.
	 */
	deleteTask(): void {
		if (confirm('Deseja apagar a tarefa?')) {
			if (!this.taskForm.value.id) {
				this._router.navigate(['']);
				return;
			}

			this._taskService.deleteTask(this.taskForm.value.id).subscribe({
				next: () => this._router.navigate(['']),
				error: (err: Error) => console.error('Erro ao apagar tarefa:', err),
			})
		}
	}

	/**
	 * Método utilizado no html para renderizar o texto baseado no status da tarefa.
	 * Concluída: "Visualizar tarefa";
	 * Tarefa criada e não concluída: "Editar tarefa";
	 * E "Criar nova tarefa".
	 */
	getLabel(): string {
		if (this.isEditMode && this.task.status === StatusEnum.Completed) return 'Visualizar tarefa';
		else if (this.isEditMode) return 'Editar tarefa';
		return 'Criar nova tarefa';
	}

	isFinishedTask(): boolean {
		return !!(this.task && this.task.status === StatusEnum.Completed);
	}
}