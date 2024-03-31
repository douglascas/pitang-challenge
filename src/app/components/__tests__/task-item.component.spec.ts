import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { TaskItemComponent } from '../tasks-table/task-item.component';
import { TaskService } from '../../services/task.service';
import { StatusEnum, Task } from '../../models/task';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: any;

  const mockTask: Task = {
    id: '1',
    title: 'Tarefa 1',
    status: StatusEnum.Pending,
    description: '',
    created: new Date(),
    lastEdit: new Date(),
    completionDate: undefined as any,
  };

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['deleteTask']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TaskItemComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve definir isMobile como true quando a largura da janela é <= 768', () => {
    expect(component.isMobile).toBeFalsy();
    spyOnProperty(window, 'innerWidth').and.returnValue(768);
    window.dispatchEvent(new Event('resize'));
    expect(component.isMobile).toBeTruthy();
  });

  it('deve definir isMobile como false quando a largura da janela é > 768', () => {
    component.isMobile = true;
    spyOnProperty(window, 'innerWidth').and.returnValue(769);
    window.dispatchEvent(new Event('resize'));
    expect(component.isMobile).toBeFalsy();
  });

  it('deve navegar para a rota edit-task quando editItem é chamado', () => {
    component.editItem(mockTask);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['edit-task', mockTask.id]);
  });

  it('deve emitir o evento onItemDelete quando deleteItem é chamado e o usuário confirma', () => {
    taskServiceSpy.deleteTask.and.returnValue(of({}));
    spyOn(window, 'confirm').and.returnValue(true);

    component.onItemDelete.subscribe((task: Task) => {
      expect(task).toEqual(mockTask);
    });

    component.deleteItem(mockTask);
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(mockTask.id);
  });

  it('não deve emitir o evento onItemDelete quando deleteItem é chamado e o usuário cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.onItemDelete.subscribe(() => {
      fail('Não deve emitir o evento onItemDelete');
    });

    component.deleteItem(mockTask);
    expect(taskServiceSpy.deleteTask).not.toHaveBeenCalled();
  });
});
