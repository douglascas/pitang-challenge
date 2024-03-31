import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TopbarComponent } from '../topbar/topbar.component';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve conter um elemento nav com a classe "navbar"', () => {
    const navbarElement = fixture.nativeElement.querySelector('nav');
    expect(navbarElement).toBeTruthy();
    expect(navbarElement.classList.contains('navbar')).toBeTruthy();
  });
});
