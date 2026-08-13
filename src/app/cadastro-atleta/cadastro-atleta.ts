import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CepService } from '../services/cep.service';

@Component({
  selector: 'app-cadastro-atleta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-atleta.html',
  styleUrl: './cadastro-atleta.css'
})
export class CadastroAtleta {
  // Controle do formulário e estados de carregamento do CEP
  atletaForm: FormGroup;
  carregandoCep = false;
  mensagemCep = '';

  constructor(
    private fb: FormBuilder,
    private cepService: CepService
  ) {
    // Inicialização do formulário reativo e suas regras de validação
    this.atletaForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      sexo: ['', Validators.required],
      cep: ['', [Validators.required, Validators.minLength(8)]],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required]
    });
  }

  // Busca e preenche o endereço automaticamente a partir do CEP
  buscarCep(): void {
    let cep = this.atletaForm.get('cep')?.value;
    if (!cep) return;

    // Remove caracteres não numéricos
    cep = cep.replace(/\D/g, '');

    if (cep.length !== 8) {
      this.mensagemCep = 'Digite um CEP válido.';
      return;
    }

    this.carregandoCep = true;
    this.mensagemCep = '';

    this.cepService.buscarCep(cep).subscribe({
      next: (endereco) => {
        this.carregandoCep = false;

        // Trata CEP não encontrado no webservice
        if (endereco.erro) {
          this.mensagemCep = 'CEP não encontrado.';
          this.atletaForm.patchValue({
            logradouro: '',
            bairro: '',
            cidade: '',
            uf: ''
          });
          return;
        }

        // Preenche os campos do formulário com o retorno do CEP
        this.atletaForm.patchValue({
          logradouro: endereco.logradouro,
          bairro: endereco.bairro,
          cidade: endereco.localidade,
          uf: endereco.uf
        });
      },
      error: () => {
        this.carregandoCep = false;
        this.mensagemCep = 'Não foi possível consultar o CEP.';
      }
    });
  }

  // Valida e envia o formulário
  cadastrar(): void {
    // Se inválido, marca os campos para exibir as mensagens de erro na tela
    if (this.atletaForm.invalid) {
      this.atletaForm.markAllAsTouched();
      return;
    }

    console.log('Atleta cadastrado:', this.atletaForm.value);
    alert('Atleta cadastrado com sucesso!');
    this.atletaForm.reset();
  }
}