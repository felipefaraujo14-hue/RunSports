import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CorridaService } from '../services/corrida.service';

@Component({
  selector: 'app-cadastro-corrida',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro-corrida.html',
  styleUrl: './cadastro-corrida.css'
})
export class CadastroCorrida {

  corridaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private corridaService: CorridaService
  ) {

    this.corridaForm = this.fb.group({

      descricao: [
        '',
        Validators.required
      ],

      data: [
        '',
        Validators.required
      ],

      cincoKm: [
        false
      ],

      dezKm: [
        false
      ],

      vinteCincoKm: [
        false
      ]

    });

  }

  cadastrar(): void {

    if (this.corridaForm.invalid) {

      this.corridaForm.markAllAsTouched();

      alert(
        'Preencha a descrição e a data da corrida.'
      );

      return;
    }

    const dados = this.corridaForm.value;

    const distancias: string[] = [];

    if (dados.cincoKm) {
      distancias.push('5km');
    }

    if (dados.dezKm) {
      distancias.push('10km');
    }

    if (dados.vinteCincoKm) {
      distancias.push('25km');
    }

    if (distancias.length === 0) {

      alert(
        'Selecione pelo menos uma distância.'
      );

      return;
    }

    const corrida = {
      id: Date.now(),
      descricao: dados.descricao,
      data: dados.data,
      distancias: distancias
    };

    this.corridaService.adicionar(corrida);

    console.log(
      'Corrida cadastrada:',
      corrida
    );

    alert(
      'Corrida cadastrada com sucesso!'
    );

    this.corridaForm.reset({
      descricao: '',
      data: '',
      cincoKm: false,
      dezKm: false,
      vinteCincoKm: false
    });
  }
}