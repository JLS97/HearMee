import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionofertaComponent } from './gestionoferta.component';

describe('GestionofertaComponent', () => {
  let component: GestionofertaComponent;
  let fixture: ComponentFixture<GestionofertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionofertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionofertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
