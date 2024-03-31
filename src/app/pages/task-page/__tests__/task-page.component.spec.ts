import { ComponentFixture, TestBed } from "@angular/core/testing";
import { StatusEnum, Task } from "../../../models/task";
import { TaskPageComponent } from "../task-page.component";
import { TaskService } from "../../../services/task.service";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of } from "rxjs";
import { HttpClient, HttpHandler } from "@angular/common/http";

describe('TaskPageComponent', () => {
  let component: TaskPageComponent;
  let fixture: ComponentFixture<TaskPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskPageComponent],
      providers: [
        HttpClient,
        HttpHandler,
        TaskService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of(convertToParamMap({ id: '1' }))
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve retornar "Visualizar tarefa" se a tarefa estiver concluída e estiver no modo de edição', () => {
    component.isEditMode = true;
    component.task = { status: StatusEnum.Completed } as Task;
    expect(component.getLabel()).toEqual('Visualizar tarefa');
  });

  it('deve retornar "Editar tarefa" se a tarefa não estiver concluída e estiver no modo de edição', () => {
    component.isEditMode = true;
    component.task = { status: StatusEnum.InProgress } as Task;
    expect(component.getLabel()).toEqual('Editar tarefa');
  });

  it('deve retornar "Criar nova tarefa" se não estiver no modo de edição', () => {
    component.isEditMode = false;
    expect(component.getLabel()).toEqual('Criar nova tarefa');
  });

  it('deve retornar true se a tarefa estiver concluída', () => {
    component.task = { status: StatusEnum.Completed } as Task;
    expect(component.isFinishedTask()).toBe(true);
  });

  it('deve retornar false se a tarefa não estiver concluída', () => {
    component.task = { status: StatusEnum.InProgress } as Task;
    expect(component.isFinishedTask()).toBe(false);
  });
});