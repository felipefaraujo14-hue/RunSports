import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAtleta } from './cadastro-atleta';

describe('CadastroAtleta', () => {
  let component: CadastroAtleta;
  let fixture: ComponentFixture<CadastroAtleta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAtleta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroAtleta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
