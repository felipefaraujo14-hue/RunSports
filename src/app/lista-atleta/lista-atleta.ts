import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PessoaService, Atleta } from '../services/pessoa.service';

@Component({
  selector: 'app-lista-atleta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-atleta.html',
  styleUrls: ['./lista-atleta.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaAtleta implements OnInit {
  atletas: Atleta[] = [];
  carregando = false;

  constructor(
    private pessoaService: PessoaService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarAtletas();
  }

  // Carrega a listagem do serviço e força a verificação de mudanças para OnPush
  async carregarAtletas(): Promise<void> {
    this.carregando = true;
    this.cdr.markForCheck();

    try {
      this.atletas = await this.pessoaService.listar();
    } catch (error) {
      console.error('Erro ao carregar atletas:', error);
      this.atletas = [];
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  // Redireciona para a tela de edição enviando o ID via parâmetro de rota
  editarAtleta(atleta: Atleta): void {
    console.log('Atleta selecionado para editar:', atleta);

    if (atleta.id === undefined) {
      alert('Este atleta não possui ID.');
      return;
    }

    this.router.navigate(['/cadastro-atleta', atleta.id]);
  }

  // Exclui o atleta e atualiza a lista de forma imutável
  async excluirAtleta(id: number | undefined): Promise<void> {
    if (id === undefined) {
      alert('ID do atleta não informado.');
      return;
    }

    const atleta = this.atletas.find(item => item.id === id);
    if (!atleta || !confirm(`Deseja realmente excluir "${atleta.nome}"?`)) return;

    try {
      await this.pessoaService.excluir(id);
      this.atletas = this.atletas.filter(item => item.id !== id);
      this.cdr.markForCheck();
      alert('Atleta excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir atleta:', error);
      alert('Erro ao excluir atleta.');
    }
  }
}