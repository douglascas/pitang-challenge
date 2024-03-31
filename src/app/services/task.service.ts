import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StatusEnum, Task } from '../models/task';

@Injectable({
	providedIn: 'root'
})
export class TaskService {

	private _tasks: Task[] = [];
	private _apiUrl = 'http://localhost:3000/tasks';

	constructor(private _http: HttpClient) { }

	/**
	 * Obtém o valor do próximo ID para salvar no db do Json Server, garantindo que na criação de uma nova tarefa, 
	 * sempre tenha um id único e autoincrementado. 
	 */
	private _getNextId(): number {
		const lastIndexId = this._tasks[this._tasks.length - 1]?.id || this._tasks.length;
		return lastIndexId + 1;
	}

	/**
	 * Obtém a lista de tarefas da API.
	 */
	getTasks(): Observable<Task[]> {
		return this._http.get<Task[]>(this._apiUrl)
			.pipe(tap(tasks => this._tasks = tasks));
	}

	/**
	 * Obtém uma tarefa específica com base no ID informado.
	 */
	getTaskById(id: number): Observable<Task> {
		const url = `${this._apiUrl}/${id}`;
		return this._http.get<Task>(url);
	}

	/**
	 * Adiciona uma nova tarefa no db.
	 */
	addTask(task: Task): Observable<Task> {
		task = {
			...task,
			id: this._getNextId(),
			status: StatusEnum.Pending,
			completionDate: task.completionDate || new Date(),
		}
		return this._http.post<Task>(this._apiUrl, task);
	}

	/**
	 * Atualiza a tarefa selecionada com base nos parâmetros informados no formulário.
	 * Caso o `status` seja alterado para `Concluído`, também é adicionado alguns atributos no objeto em questão.
	 */
	updateTask(task: Task): Observable<Task> {
		task.lastEdit = new Date();

		if (task.status === StatusEnum.Completed) {
			task = {
				...task,
				lastEdit: new Date(),
				completionDate: task.completionDate || new Date(),
				finished: new Date(),
			};
		}

		const url = `${this._apiUrl}/${task.id}`;
		return this._http.put<Task>(url, task);
	}

	/**
	 * Remove uma tarefa do db com base em seu `id`.
	 */
	deleteTask(id: number): Observable<any> {
		const url = `${this._apiUrl}/${id}`;
		return this._http.delete<Task>(url);
	}
}