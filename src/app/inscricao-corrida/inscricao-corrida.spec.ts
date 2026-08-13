import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscricaoCorrida } from './inscricao-corrida';

describe('InscricaoCorrida', () => {
  let component: InscricaoCorrida;
  let fixture: ComponentFixture<InscricaoCorrida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscricaoCorrida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscricaoCorrida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
