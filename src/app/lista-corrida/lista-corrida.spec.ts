import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCorrida } from './lista-corrida';

describe('ListaCorrida', () => {
  let component: ListaCorrida;
  let fixture: ComponentFixture<ListaCorrida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCorrida],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaCorrida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
