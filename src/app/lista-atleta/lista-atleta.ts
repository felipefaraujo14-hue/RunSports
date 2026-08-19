import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService, Atleta } from '../services/pessoa.service';

@Component({
  selector: 'app-lista-atleta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-atleta.html',
  styleUrls: ['./lista-atleta.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaAtleta implements OnInit {
  atletas: Atleta[] = [];
  carregando = false;
  salvando = false;
  atletaEditando: Atleta | null = null;

  constructor(
    private pessoaService: PessoaService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarAtletas();
  }

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

  editarAtleta(atleta: Atleta): void {
    this.atletaEditando = { ...atleta };
    this.cdr.markForCheck();
  }

  cancelarEdicao(): void {
    this.atletaEditando = null;
    this.cdr.markForCheck();
  }

  async salvarEdicao(): Promise<void> {
    if (!this.atletaEditando?.id) {
      if (!this.atletaEditando) return;
      alert('ID do atleta não informado.');
      return;
    }

    this.salvando = true;
    this.cdr.markForCheck();

    try {
      const atualizado = await this.pessoaService.atualizar(this.atletaEditando);

      // Atualização imutável do array para garantir reatividade
      this.atletas = this.atletas.map(item =>
        item.id === atualizado.id ? atualizado : item
      );

      this.atletaEditando = null;
      alert('Atleta atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar atleta.');
    } finally {
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }

  async excluirAtleta(id: number | undefined): Promise<void> {
    if (!id) return;

    const atleta = this.atletas.find(item => item.id === id);
    if (!atleta || !confirm(`Deseja realmente excluir "${atleta.nome}"?`)) return;

    try {
      await this.pessoaService.excluir(id);
      this.atletas = this.atletas.filter(item => item.id !== id);
      alert('Atleta excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir atleta.');
    } finally {
      this.cdr.markForCheck();
    }
  }
}