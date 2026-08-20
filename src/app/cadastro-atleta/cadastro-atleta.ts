import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CepService } from '../services/cep.service';
import { PessoaService, Atleta } from '../services/pessoa.service';

@Component({
  selector: 'app-cadastro-atleta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-atleta.html',
  styleUrl: './cadastro-atleta.css'
})
export class CadastroAtleta implements OnInit {
  atletaForm: FormGroup;
  carregandoCep = false;
  mensagemCep = '';
  atletaId: number | null = null;
  modoEdicao = false;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private pessoaService: PessoaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Configuração inicial do formulário reativo
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

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.atletaId = Number(id);
      this.modoEdicao = true;
      await this.carregarAtleta(this.atletaId);
    }
  }

  // Carrega os dados do atleta caso esteja no modo de edição
  async carregarAtleta(id: number): Promise<void> {
    try {
      const atleta = await this.pessoaService.buscarPorId(id);

      if (!atleta) {
        alert('Atleta não encontrado.');
        this.router.navigate(['/lista-atleta']);
        return;
      }

      this.atletaForm.patchValue({
        nome: atleta.nome,
        cpf: atleta.cpf,
        sexo: atleta.sexo,
        cep: atleta.cep,
        logradouro: atleta.logradouro,
        bairro: atleta.bairro,
        cidade: atleta.cidade,
        uf: atleta.uf
      });
    } catch (error) {
      console.error('Erro ao carregar atleta:', error);
      alert('Erro ao carregar atleta.');
      this.router.navigate(['/lista-atleta']);
    }
  }

  // Faz a requisição à API ViaCEP e auto-preenche o endereço
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

  // Gerencia o fluxo de submissão (Criação ou Atualização)
  async cadastrar(): Promise<void> {
    if (this.atletaForm.invalid) {
      this.atletaForm.markAllAsTouched();
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (this.salvando) return;

    this.salvando = true;
    const dados = this.atletaForm.value;
    const cpfLimpo = dados.cpf.replace(/\D/g, '');

    try {
      // --- MODO EDIÇÃO ---
      if (this.modoEdicao && this.atletaId) {
        const atletaAtualizado: Atleta = {
          id: this.atletaId,
          nome: dados.nome,
          cpf: cpfLimpo,
          sexo: dados.sexo,
          cep: dados.cep.replace(/\D/g, ''),
          logradouro: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.cidade,
          uf: dados.uf.toUpperCase()
        };

        await this.pessoaService.atualizar(atletaAtualizado);
        alert('Atleta atualizado com sucesso!');
        this.router.navigate(['/lista-atleta']);
        return;
      }

      // --- MODO CADASTRO ---
      const atletaExistente = await this.pessoaService.buscarPorCpf(cpfLimpo);

      if (atletaExistente) {
        alert('Já existe um atleta cadastrado com este CPF.');
        return;
      }

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

      await this.pessoaService.adicionar(atleta);
      alert('Atleta cadastrado com sucesso!');
      this.atletaForm.reset();
      this.mensagemCep = '';
    } catch (error: any) {
      console.error('ERRO COMPLETO:', error);
      alert(`Erro ao salvar atleta:\n\n${error?.message || 'Erro desconhecido'}`);
    } finally {
      this.salvando = false;
    }
  }
}