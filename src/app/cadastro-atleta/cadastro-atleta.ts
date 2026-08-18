import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CepService } from '../services/cep.service';
import { PessoaService, Atleta } from '../services/pessoa.service';

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

  atletaForm: FormGroup;

  carregandoCep = false;
  mensagemCep = '';

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private pessoaService: PessoaService
  ) {
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

  buscarCep(): void {

    let cep = this.atletaForm.get('cep')?.value;

    if (!cep) return;

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

  async cadastrar(): Promise<void> {

    // Verifica se o formulário está válido
    if (this.atletaForm.invalid) {
      this.atletaForm.markAllAsTouched();
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const dados = this.atletaForm.value;

    const cpfLimpo = dados.cpf.replace(/\D/g, '');

    try {

      // Verifica se o CPF já existe no Supabase
      const atletaExistente =
        await this.pessoaService.buscarPorCpf(cpfLimpo);

      if (atletaExistente) {
        alert('Já existe um atleta cadastrado com este CPF.');
        return;
      }

      // Cria o objeto do atleta
      const atleta: Atleta = {
        nome: dados.nome,
        cpf: cpfLimpo,
        sexo: dados.sexo,
        cep: dados.cep.replace(/\D/g, ''),
        logradouro: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.cidade,
        uf: dados.uf.toUpperCase()
      };

      // Salva no Supabase
      const atletaCadastrado =
        await this.pessoaService.adicionar(atleta);

      console.log(
        'Atleta cadastrado:',
        atletaCadastrado
      );

      alert('Atleta cadastrado com sucesso!');

      // Limpa o formulário
      this.atletaForm.reset();
      this.mensagemCep = '';

    } catch (error: any) {

      console.error('ERRO COMPLETO DO SUPABASE:', error);
    
      console.error('Mensagem:', error?.message);
      console.error('Código:', error?.code);
      console.error('Detalhes:', error?.details);
      console.error('Hint:', error?.hint);
    
      alert(
        'Erro ao cadastrar atleta:\n\n' +
        (error?.message || 'Erro desconhecido')
      );
    }
  }
}