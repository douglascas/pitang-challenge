import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskTableComponent } from '../tasks-table/tasks-table.component';
import { StatusEnum, Task } from '../../models/task';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('TaskTableComponent', () => {
  let component: TaskTableComponent;
  let fixture: ComponentFixture<TaskTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar as opções de ordenação no ngOnInit', () => {
    expect(component.sortOptions).toBeDefined();
    expect(component.sortOptions.length).toBe(4);
  });

  it('deve definir as tarefas corretamente quando o input de tarefas é definido', () => {
    const mockTasks: Task[] = [
      {
        id: '1', title: 'Task 1', status: StatusEnum.Pending,
        description: '',
        created: new Date(),
        completionDate: undefined as any,
        lastEdit: new Date()
      },
      {
        id: '2', title: 'Task 2', status: StatusEnum.Completed,
        description: '',
        created: new Date(),
        completionDate: new Date(),
        lastEdit: new Date()
      }
    ];
    component.tasks = mockTasks;
    expect(component.tasks).toEqual(mockTasks);
  });

  it('deve filtrar as tarefas corretamente quando onSortChange é chamado', () => {
    const mockTasks: Task[] = [
      {
        id: '1', title: 'Task 1', status: StatusEnum.Pending,
        description: '',
        created: new Date(),
        completionDate: undefined as any,
        lastEdit: new Date()
      },
      {
        id: '2', title: 'Task 2', status: StatusEnum.Completed,
        description: '',
        created: new Date(),
        completionDate: new Date(),
        lastEdit: new Date()
      },
      {
        id: '3', title: 'Task 3', status: StatusEnum.InProgress,
        description: '',
        created: new Date(),
        completionDate: undefined as any,
        lastEdit: new Date()
      },
      {
        id: '4', title: 'Task 4', status: StatusEnum.Pending,
        description: '',
        created: new Date(),
        completionDate: undefined as any,
        lastEdit: new Date()
      }
    ];
    component.tasks = mockTasks;

    // Testando filtro por status "Concluído"
    component.onSortChange({ value: StatusEnum.Completed });
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].status).toBe(StatusEnum.Completed);

    // Testando filtro por status "Em andamento"
    component.onSortChange({ value: StatusEnum.InProgress });
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].status).toBe(StatusEnum.InProgress);

    // Testando filtro por status "Pendente"
    component.onSortChange({ value: StatusEnum.Pending });
    expect(component.tasks.length).toBe(2);
    expect(component.tasks.every(task => task.status === StatusEnum.Pending)).toBeTruthy();

    // Testando filtro quando seleciona "Todos"
    component.onSortChange({ value: '' });
    expect(component.tasks).toEqual(mockTasks);
  });

  it('deve excluir a tarefa corretamente da lista quando deleteTaskFromList é chamado', () => {
    const mockTasks: Task[] = [
      {
        id: '1', title: 'Task 1', status: StatusEnum.Pending,
        description: '',
        created: new Date(),
        completionDate: undefined as any,
        lastEdit: new Date()
      },
      {
        id: '2', title: 'Task 2', status: StatusEnum.Completed,
        description: '',
        created: new Date(),
        completionDate: undefined as any,
        lastEdit: new Date()
      },
      {
        id: '3', title: 'Task 3', status: StatusEnum.InProgress,
        description: '',
        created: new Date(),
        completionDate: undefined as any,
        lastEdit: new Date()
      }
    ];

    component.tasks = mockTasks;

    // Remove Task 2
    const taskToDelete: Task = mockTasks[1];
    component.deleteTaskFromList(taskToDelete);
    expect(component.tasks.length).toBe(2);
    expect(component.tasks.some(task => task.id === taskToDelete.id)).toBeFalsy();

    // Remove Task 1
    component.deleteTaskFromList(mockTasks[0]);
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].id).toBe('3');

    // Remove Task 3
    component.deleteTaskFromList(mockTasks[2]);
    expect(component.tasks.length).toBe(0);
  });
});