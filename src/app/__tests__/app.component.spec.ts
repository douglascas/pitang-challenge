import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../app.component';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importe HttpClientTestingModule
import { TaskService } from '../services/task.service';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule, // Adicione HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        TopbarComponent,
      ],
      providers: [
        TaskService,
      ]
    }).compileComponents();
  });


  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});