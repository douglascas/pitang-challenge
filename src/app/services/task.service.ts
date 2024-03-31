import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { StatusEnum, Task } from '../models/task';

@Injectable({
	providedIn: 'root'
})
export class TaskService {

	private _apiUrl = 'http://localhost:3000/tasks';

	constructor(private _http: HttpClient) { }

	/**
	 * Obtém a lista de tarefas da API.
	 */
	getTasks(): Observable<Task[]> {
		return this._http.get<Task[]>(this._apiUrl);
	}

	/**
	 * Obtém uma tarefa específica com base no ID informado.
	 */
	getTaskById(id: string): Observable<Task> {
		const url = `${this._apiUrl}/${id}`;
		return this._http.get<Task>(url);
	}

	/**
	 * Adiciona uma nova tarefa no db.
	 */
	addTask(task: Task): Observable<Task> {
		task = {
			...task,
			id: uuidv4(),
			status: StatusEnum.Pending,
			lastEdit: new Date(),
			completionDate: task.completionDate || null,
		}

		return this._http.post<Task>(this._apiUrl, task);
	}

	/**
	 * Atualiza a tarefa selecionada com base nos parâmetros informados no formulário.
	 * Caso o `status` seja alterado para `Concluído`, também é adicionado alguns atributos no objeto em questão, 
	 * além de substituir a data de conclusão (estimativa), caso tenha sido preenchida, para a data real de conclusão.
	 */
	updateTask(task: Task): Observable<Task> {
		task.lastEdit = new Date();

		if (task.status === StatusEnum.Completed) {
			task = {
				...task,
				completionDate: new Date(),
			};
		}

		const url = `${this._apiUrl}/${task.id}`;
		return this._http.put<Task>(url, task);
	}

	/**
	 * Remove uma tarefa do db com base em seu `id`.
	 */
	deleteTask(id: string): Observable<any> {
		const url = `${this._apiUrl}/${id}`;
		return this._http.delete<Task>(url);
	}
}