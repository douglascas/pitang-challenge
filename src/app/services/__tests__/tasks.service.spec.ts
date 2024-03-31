import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from '../task.service';
import { StatusEnum, Task } from '../../models/task';
import { v4 as uuidv4 } from 'uuid';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('deve criar o service', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar tarefas no getTasks()', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        lastEdit: new Date(),
        status: StatusEnum.Completed,
        description: 'Lorem ipsum sit amet...',
        created: new Date(),
        completionDate: undefined as any,
      },
      {
        id: '2',
        title: 'Task 2',
        lastEdit: new Date(),
        status: StatusEnum.InProgress,
        description: 'Lorem ipsum sit amet...',
        created: new Date(),
        completionDate: undefined as any,
      }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toEqual('GET');
    req.flush(mockTasks);
  });

  it('deve recuperar uma tarefa por ID via GET', () => {
    const taskId = '1';
    const mockTask: Task = {
      id: taskId,
      title: 'Task 1',
      status: StatusEnum.Pending,
      lastEdit: new Date(),
      description: '',
      created: new Date(),
      completionDate: undefined as any,
    };

    service.getTaskById(taskId).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/tasks/${taskId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockTask);
  });

  it('deve adicionar uma nova tarefa via POST', () => {
    const newTask: Task = {
      title: 'New Task', status: StatusEnum.Pending, lastEdit: new Date(),
      id: '',
      description: '',
      created: new Date(),
      completionDate: undefined as any,
    };
    const mockResponse: Task = { ...newTask, id: uuidv4() };

    service.addTask(newTask).subscribe(task => {
      expect(task).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('deve atualizar uma tarefa existente via PUT', () => {
    const updatedTask: Task = {
      id: '1', title: 'Updated Task', status: StatusEnum.Completed, lastEdit: new Date(),
      description: '',
      created: new Date(),
      completionDate: undefined as any,
    };

    service.updateTask(updatedTask).subscribe(task => {
      expect(task).toEqual(updatedTask);
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/tasks/${updatedTask.id}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(updatedTask);
  });

  it('deve remover uma tarefa via DELETE', () => {
    const taskId = '1';

    service.deleteTask(taskId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpTestingController.expectOne(`http://localhost:3000/tasks/${taskId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
