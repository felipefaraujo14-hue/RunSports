import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CepService } from '../services/cep.service';
import { PessoaService } from '../services/pessoa.service';

@Component({
  selector: 'app-cadastro-atleta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro-atleta.html',
  styleUrl: './cadastro-atleta.css'
})
export class CadastroAtleta {
  // Objeto principal do formulário reativo
  atletaForm: FormGroup;

  // Controle de estado para carregamento e validação visual do CEP
  carregandoCep = false;
  mensagemCep = '';

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private pessoaService: PessoaService
  ) {
    // Inicialização do formulário reativo com suas respectivas validações
    this.atletaForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      sexo: ['', Validators.required],
      cep: ['', [Validators.required, Validators.minLength(8)]],
      logradouro: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required]
    });
  }

  /**
   * Consulta a API externa de CEP para auto-preencher o endereço do atleta.
   */
  buscarCep(): void {
    let cep = this.atletaForm.get('cep')?.value;

    if (!cep) return;

    // Remove caracteres não numéricos do CEP
    cep = cep.replace(/\D/g, '');

    if (cep.length !== 8) {
      this.mensagemCep = 'Digite um CEP válido.';
      return;
    }

    this.carregandoCep = true;
    this.mensagemCep = '';

    // Chamada assíncrona ao serviço de CEP
    this.cepService.buscarCep(cep).subscribe({
      next: (endereco) => {
        this.carregandoCep = false;

        // Trata retorno de CEP inexistente
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

        // Preenche automaticamente os campos do formulário
        this.atletaForm.patchValue({
          logradouro: endereco.logradouro,
          bairro: endereco.bairro,
          cidade: endereco.localidade,
          uf: endereco.uf
        });
      },
      error: () => {
        this.carregandoCep = false;
        this.mensagemCep = 'Erro ao consultar o CEP.';
      }
    });
  }

  /**
   * Valida e submete o formulário para cadastro do atleta.
   */
  cadastrar(): void {
    // Verifica se há pendências no preenchimento do formulário
    if (this.atletaForm.invalid) {
      this.atletaForm.markAllAsTouched();
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const dados = this.atletaForm.value;
    const cpfLimpo = dados.cpf.replace(/\D/g, '');

    // Valida duplicidade de CPF antes do salvamento
    const atletaExistente = this.pessoaService.buscarPorCpf(cpfLimpo);
    if (atletaExistente) {
      alert('Já existe um atleta cadastrado com este CPF.');
      return;
    }

    // Monta o objeto formatado do novo atleta
    const atleta = {
      id: Date.now(),
      nome: dados.nome,
      cpf: cpfLimpo,
      sexo: dados.sexo,
      cep: dados.cep.replace(/\D/g, ''),
      logradouro: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.cidade,
      uf: dados.uf.toUpperCase()
    };

    // Salva no serviço e finaliza o processo
    this.pessoaService.adicionar(atleta);
    console.log('Atleta cadastrado:', atleta);
    alert('Atleta cadastrado com sucesso!');

    // Limpa o formulário e os estados auxiliares
    this.atletaForm.reset();
    this.mensagemCep = '';
  }
}