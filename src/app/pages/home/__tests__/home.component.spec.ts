import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HomeComponent } from '../home.component';
import { TaskService } from '../../../services/task.service';
import { StatusEnum, Task } from '../../../models/task';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let router: Router;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks']);
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy }
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('deve criar o compoennte', () => {
    expect(component).toBeTruthy();
  });

  it('deve retornar a lista de tarefas na inicialização', () => {
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

    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();

    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
  });

  it('deve retornar para a página de criação de nova tarefa', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.redirectToCreateTask();
    expect(navigateSpy).toHaveBeenCalledWith(['/new-task']);
  });
});