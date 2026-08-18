import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Corrida, CorridaService } from '../services/corrida.service';
import { Atleta, PessoaService } from '../services/pessoa.service';

@Component({
  selector: 'app-inscricao-corrida',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inscricao-corrida.html',
  styleUrl: './inscricao-corrida.css'
})
export class InscricaoCorrida implements OnInit {
  // Propriedades da classe
  inscricaoForm: FormGroup;
  corridaSelecionada?: Corrida;
  valorInscricao = 89.90;
  atletas: Atleta[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private corridaService: CorridaService,
    private pessoaService: PessoaService
  ) {
    // Inicialização e configuração dos campos do formulário
    this.inscricaoForm = this.fb.group({
      atleta: ['', Validators.required],
      cpf: [''],
      corrida: ['', Validators.required],
      distancia: ['', Validators.required],
      camiseta: ['', Validators.required],
      categoria: [{ value: '', disabled: true }], // Campo desabilitado para edição direta
      termos: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    // Carrega a lista inicial de atletas
    this.carregarAtletas();

    // Obtém parâmetros da URL para identificar a corrida selecionada
    this.route.queryParams.subscribe(params => {
      const id = Number(params['corrida']);

      if (id) {
        this.carregarCorrida(id);
      } else {
        this.carregarPrimeiraCorrida();
      }
    });
  }

  // ==========================================
  // GERENCIAMENTO DE ATLETAS
  // ==========================================

  /**
   * Busca e carrega a lista de atletas cadastrados no serviço.
   */
  async carregarAtletas(): Promise<void> {
    try {
      this.atletas = await this.pessoaService.listar();
      console.log('Atletas carregados:', this.atletas);
    } catch (error) {
      console.error('Erro ao carregar atletas:', error);
      alert('Erro ao carregar os atletas.');
    }
  }

  /**
   * Preenche automaticamente CPF e Categoria ao selecionar um atleta no dropdown.
   */
  selecionarAtleta(): void {
    const id = Number(this.inscricaoForm.get('atleta')?.value);
    const atleta = this.atletas.find(item => item.id === id);

    if (!atleta) {
      this.inscricaoForm.patchValue({
        cpf: '',
        categoria: ''
      });
      return;
    }

    this.inscricaoForm.patchValue({
      cpf: this.formatarCpf(atleta.cpf),
      categoria: this.calcularCategoria(atleta)
    });
  }

  /**
   * Busca informações do atleta a partir do CPF inserido no formulário.
   */
  async buscarAtletaPorCpf(): Promise<void> {
    const cpf = this.inscricaoForm.get('cpf')?.value;

    if (!cpf) return;

    try {
      const atleta = await this.pessoaService.buscarPorCpf(cpf);

      if (!atleta) {
        alert('Nenhum atleta encontrado com este CPF.');
        return;
      }

      this.inscricaoForm.patchValue({
        atleta: atleta.id,
        cpf: this.formatarCpf(atleta.cpf),
        categoria: this.calcularCategoria(atleta)
      });
    } catch (error) {
      console.error('Erro ao buscar atleta:', error);
      alert('Erro ao consultar o atleta.');
    }
  }

  /**
   * Define a categoria do atleta com base no sexo.
   */
  calcularCategoria(atleta: Atleta): string {
    if (atleta.sexo === 'Feminino') return 'Geral Feminino';
    if (atleta.sexo === 'Masculino') return 'Geral Masculino';
    return 'Categoria Geral';
  }

  /**
   * Formata a string do CPF para o padrão 000.000.000-00.
   */
  formatarCpf(cpf: string): string {
    const numero = cpf.replace(/\D/g, '');

    if (numero.length !== 11) return cpf;

    return numero.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  // ==========================================
  // GERENCIAMENTO DE CORRIDAS
  // ==========================================

  /**
   * Busca e define a corrida selecionada pelo ID informado.
   */
  carregarCorrida(id: number): void {
    const corrida = this.corridaService.buscarPorId(id);

    if (!corrida) {
      alert('Corrida não encontrada.');
      this.router.navigate(['/corrida-disponivel']);
      return;
    }

    this.corridaSelecionada = corrida;
    this.inscricaoForm.patchValue({
      corrida: this.formatarCorrida(corrida)
    });
  }

  /**
   * Seleciona a primeira corrida disponível como padrão caso nenhuma seja especificada.
   */
  carregarPrimeiraCorrida(): void {
    const corridas = this.corridaService.listar();

    if (corridas.length > 0) {
      this.corridaSelecionada = corridas[0];
      this.inscricaoForm.patchValue({
        corrida: this.formatarCorrida(corridas[0])
      });
    }
  }

  /**
   * Formata a exibição do nome e data da corrida para o campo de formulário.
   */
  formatarCorrida(corrida: Corrida): string {
    const data = this.formatarData(corrida.data);
    return `${corrida.descricao} (${data})`;
  }

  /**
   * Converte a data do formato AAAA-MM-DD para DD/MM/AAAA.
   */
  formatarData(data: string): string {
    if (data.includes('/')) return data;

    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
  }

  // ==========================================
  // FINALIZAÇÃO DA INSCRIÇÃO
  // ==========================================

  /**
   * Valida os campos do formulário, gera a inscrição e redireciona para o pagamento.
   */
  finalizarInscricao(): void {
    // Validação do formulário
    if (this.inscricaoForm.invalid) {
      this.inscricaoForm.markAllAsTouched();
      alert('Preencha todos os campos e aceite os termos da inscrição.');
      return;
    }

    if (!this.corridaSelecionada) {
      alert('Nenhuma corrida foi selecionada.');
      return;
    }

    // `getRawValue()` garante a leitura de campos desabilitados como 'categoria'
    const dados = this.inscricaoForm.getRawValue();
    const atleta = this.atletas.find(item => item.id === Number(dados.atleta));

    if (!atleta) {
      alert('Selecione um atleta cadastrado.');
      return;
    }

    // Montagem do objeto de inscrição
    const inscricao = {
      id: Date.now(),
      atletaId: atleta.id,
      atleta: atleta.nome,
      cpf: atleta.cpf,
      corridaId: this.corridaSelecionada.id,
      corrida: this.corridaSelecionada.descricao,
      dataCorrida: this.corridaSelecionada.data,
      distancia: dados.distancia,
      camiseta: dados.camiseta,
      categoria: dados.categoria,
      valor: this.valorInscricao,
      dataInscricao: new Date().toISOString()
    };

    localStorage.setItem('ultimaInscricao', JSON.stringify(inscricao));
    console.log('Inscrição realizada:', inscricao);
    alert('Inscrição realizada com sucesso!');

    this.inscricaoForm.reset();

    this.router.navigate(['/pagamento']);
  }
}