import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService, Atleta } from '../services/pessoa.service';

@Component({
  selector: 'app-lista-atleta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-atleta.html',
  styleUrls: ['./lista-atleta.css']
})
export class ListaAtleta implements OnInit {
  // Lista principal e flags de estado
  atletas: Atleta[] = [];
  carregando = false;
  salvando = false;

  // Armazena a cópia do atleta durante o fluxo de edição
  atletaEditando: Atleta | null = null;

  constructor(private pessoaService: PessoaService) {}

  async ngOnInit(): Promise<void> {
    await this.carregarAtletas();
  }

  // Carrega a listagem inicial de atletas do serviço
  async carregarAtletas(): Promise<void> {
    this.carregando = true;

    try {
      this.atletas = await this.pessoaService.listar();
      console.log('Atletas carregados:', this.atletas);
    } catch (error) {
      console.error('Erro ao carregar atletas:', error);
    } finally {
      this.carregando = false;
    }
  }

  // Prepara o formulário/modal criando uma cópia do atleta selecionado
  editarAtleta(atleta: Atleta): void {
    this.atletaEditando = { ...atleta };
    console.log('Editando atleta:', this.atletaEditando);
  }

  // Descarta as alterações e fecha a edição
  cancelarEdicao(): void {
    this.atletaEditando = null;
  }

  // Envia as alterações do atleta editado para o serviço
  async salvarEdicao(): Promise<void> {
    if (!this.atletaEditando) return;

    if (!this.atletaEditando.id) {
      alert('ID do atleta não informado.');
      return;
    }

    this.salvando = true;

    try {
      const atualizado = await this.pessoaService.atualizar(this.atletaEditando);

      // Atualiza o item diretamente na lista sem precisar recarregá-la inteira
      const index = this.atletas.findIndex(atleta => atleta.id === atualizado.id);
      if (index !== -1) {
        this.atletas[index] = atualizado;
      }

      this.atletaEditando = null;
      alert('Atleta atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar atleta.');
    } finally {
      this.salvando = false;
    }
  }

  // Remove o atleta do banco e da listagem local após confirmação
  async excluirAtleta(id: number | undefined): Promise<void> {
    if (!id) return;

    const atleta = this.atletas.find(item => item.id === id);
    if (!atleta) return;

    const confirmar = confirm(`Deseja realmente excluir "${atleta.nome}"?`);
    if (!confirmar) return;

    try {
      await this.pessoaService.excluir(id);

      // Remove o atleta excluído do array local
      this.atletas = this.atletas.filter(item => item.id !== id);
      alert('Atleta excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir atleta.');
    }
  }
}