import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAtleta } from './lista-atleta';

describe('ListaAtleta', () => {
  let component: ListaAtleta;
  let fixture: ComponentFixture<ListaAtleta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAtleta],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaAtleta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
