import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { StatusEnum, Task } from '../domain/task';
import { HttpClient } from '@angular/common/http';


@Injectable({
	providedIn: 'root'
})
export class TaskService {

	private tasks: Task[] = [];
	private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

	private apiUrl = 'http://localhost:3000/tasks';

	constructor(private _http: HttpClient) { }

	private _getNextId(): number {
		const lastIndexId = this.tasks[this.tasks.length - 1]?.id || this.tasks.length;
		return lastIndexId + 1;
	}

	getTasks(): Observable<Task[]> {
		return this._http.get<Task[]>(this.apiUrl)
			.pipe(tap(tasks => this.tasks = tasks));
	}

	getTaskById(id: number): Observable<Task> {
		const url = `${this.apiUrl}/${id}`;
		return this._http.get<Task>(url);
	}

	addTask(task: Task): Observable<Task> {
		task = {
			...task,
			id: this._getNextId(),
			status: StatusEnum.Pending,
			completionDate: task.completionDate || new Date(),
		}
		return this._http.post<Task>(this.apiUrl, task);
	}

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

		const url = `${this.apiUrl}/${task.id}`;
		return this._http.put<Task>(url, task);
	}

	deleteTask(id: number): Observable<any> {
		const url = `${this.apiUrl}/${id}`;
		return this._http.delete<Task>(url);
	}
}