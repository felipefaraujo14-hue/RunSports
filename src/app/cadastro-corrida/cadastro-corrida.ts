import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro-corrida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-corrida.html',
  styleUrl: './cadastro-corrida.css'
})
export class CadastroCorrida {
  // Controle do formulário reativo
  corridaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicialização do formulário reativo com validações básicas
    this.corridaForm = this.fb.group({
      descricao: ['', Validators.required],
      data: ['', Validators.required],
      cincoKm: [false],
      dezKm: [false],
      vinteCincoKm: [false]
    });
  }

  // Valida e processa o cadastro da corrida
  cadastrar(): void {
    // Valida os campos obrigatórios do formulário (descrição e data)
    if (this.corridaForm.invalid) {
      this.corridaForm.markAllAsTouched();
      alert('Preencha a descrição e a data da corrida.');
      return;
    }

    const corrida = this.corridaForm.value;
    const distancias: string[] = [];

    // Mapeia os checkboxes marcados para um array de distâncias
    if (corrida.cincoKm) distancias.push('5km');
    if (corrida.dezKm) distancias.push('10km');
    if (corrida.vinteCincoKm) distancias.push('25km');

    // Validação de regra de negócio: ao menos uma distância deve ser selecionada
    if (distancias.length === 0) {
      alert('Selecione pelo menos uma distância.');
      return;
    }

    // Monta o objeto final da corrida para salvar
    const corridaCadastrada = {
      id: Date.now(),
      descricao: corrida.descricao,
      data: corrida.data,
      distancias: distancias
    };

    console.log('Corrida cadastrada:', corridaCadastrada);
    alert('Corrida cadastrada com sucesso!');

    // Reseta o formulário para os valores padrão
    this.corridaForm.reset({
      descricao: '',
      data: '',
      cincoKm: false,
      dezKm: false,
      vinteCincoKm: false
    });
  }
}