import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistaCardComponent } from './artista-card.component';

describe('ArtistaCardComponent', () => {
  let component: ArtistaCardComponent;
  let fixture: ComponentFixture<ArtistaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistaCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
