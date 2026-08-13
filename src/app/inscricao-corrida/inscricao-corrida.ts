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
    // Inicialização do formulário reativo e validações
    this.inscricaoForm = this.fb.group({
      atleta: ['', Validators.required],
      cpf: [''],
      corrida: ['', Validators.required],
      distancia: ['', Validators.required],
      camiseta: ['', Validators.required],
      categoria: [{ value: '', disabled: true }],
      termos: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.carregarAtletas();

    // Obtém o ID da corrida passado nos parâmetros da URL
    this.route.queryParams.subscribe(params => {
      const id = Number(params['corrida']);
      if (id) {
        this.carregarCorrida(id);
      } else {
        this.carregarPrimeiraCorrida();
      }
    });
  }

  // --- GERENCIAMENTO DE ATLETAS ---

  carregarAtletas(): void {
    this.atletas = this.pessoaService.listar();
  }

  // Atualiza CPF e Categoria ao selecionar o atleta no dropdown
  selecionarAtleta(): void {
    const id = Number(this.inscricaoForm.get('atleta')?.value);
    const atleta = this.atletas.find(item => item.id === id);

    if (!atleta) {
      this.inscricaoForm.patchValue({ cpf: '', categoria: '' });
      return;
    }

    this.inscricaoForm.patchValue({
      cpf: this.formatarCpf(atleta.cpf),
      categoria: this.calcularCategoria(atleta)
    });
  }

  // Busca atleta pelo CPF preenchido manualmente
  buscarAtletaPorCpf(): void {
    const cpf = this.inscricaoForm.get('cpf')?.value;
    if (!cpf) return;

    const atleta = this.pessoaService.buscarPorCpf(cpf);
    if (!atleta) {
      alert('Nenhum atleta encontrado com este CPF.');
      return;
    }

    this.inscricaoForm.patchValue({
      atleta: atleta.id,
      cpf: this.formatarCpf(atleta.cpf),
      categoria: this.calcularCategoria(atleta)
    });
  }

  calcularCategoria(atleta: Atleta): string {
    if (atleta.sexo === 'Feminino') return 'Geral Feminino';
    if (atleta.sexo === 'Masculino') return 'Geral Masculino';
    return 'Categoria Geral';
  }

  formatarCpf(cpf: string): string {
    const numero = cpf.replace(/\D/g, '');
    if (numero.length !== 11) return cpf;
    return numero.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  // --- GERENCIAMENTO DE CORRIDAS ---

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

  carregarPrimeiraCorrida(): void {
    const corridas = this.corridaService.listar();

    if (corridas.length > 0) {
      this.corridaSelecionada = corridas[0];
      this.inscricaoForm.patchValue({
        corrida: this.formatarCorrida(corridas[0])
      });
    }
  }

  formatarCorrida(corrida: Corrida): string {
    const data = this.formatarData(corrida.data);
    return `${corrida.descricao} (${data})`;
  }

  formatarData(data: string): string {
    if (data.includes('/')) return data;

    const partes = data.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return data;
  }

  // --- FINALIZAÇÃO DA INSCRIÇÃO ---

  finalizarInscricao(): void {
    if (this.inscricaoForm.invalid) {
      this.inscricaoForm.markAllAsTouched();
      alert('Preencha todos os campos e aceite os termos da inscrição.');
      return;
    }

    if (!this.corridaSelecionada) {
      alert('Nenhuma corrida foi selecionada.');
      return;
    }

    const dados = this.inscricaoForm.getRawValue();
    const atleta = this.atletas.find(item => item.id === Number(dados.atleta));

    if (!atleta) {
      alert('Selecione um atleta cadastrado.');
      return;
    }

    // Monta o objeto de inscrição
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

    // Salva no localStorage e redireciona
    localStorage.setItem('ultimaInscricao', JSON.stringify(inscricao));
    console.log('Inscrição realizada:', inscricao);

    alert('Inscrição realizada com sucesso!');
    this.router.navigate(['/pagamento']);
  }
}