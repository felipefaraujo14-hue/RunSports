import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridasDisponiveis } from './corridas-disponiveis';

describe('CorridasDisponiveis', () => {
  let component: CorridasDisponiveis;
  let fixture: ComponentFixture<CorridasDisponiveis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorridasDisponiveis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorridasDisponiveis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
