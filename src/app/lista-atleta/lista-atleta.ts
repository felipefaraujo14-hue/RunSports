import { Component, OnInit } from '@angular/common';
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
  // Estado e dados do componente
  atletas: Atleta[] = [];
  carregando = false;
  salvando = false;

  // Armazena a cópia do atleta em edição (ou null se nenhum estiver selecionado)
  atletaEditando: Atleta | null = null;

  constructor(private pessoaService: PessoaService) {}

  async ngOnInit(): Promise<void> {
    await this.carregarAtletas();
  }

  /**
   * Busca a lista atualizada de atletas cadastrados.
   */
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

  /**
   * Cria uma cópia independente do atleta selecionado para o formulário de edição.
   */
  editarAtleta(atleta: Atleta): void {
    this.atletaEditando = { ...atleta };
    console.log('Editando atleta:', this.atletaEditando);
  }

  /**
   * Cancela a edição fechando o formulário e descartando as alterações.
   */
  cancelarEdicao(): void {
    this.atletaEditando = null;
  }

  /**
   * Envia as alterações do atleta ao backend e atualiza a lista em memória.
   */
  async salvarEdicao(): Promise<void> {
    if (!this.atletaEditando) return;

    if (!this.atletaEditando.id) {
      alert('ID do atleta não informado.');
      return;
    }

    this.salvando = true;

    try {
      const atualizado = await this.pessoaService.atualizar(this.atletaEditando);

      // Atualiza o registro diretamente no array local sem recarregar tudo
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

  /**
   * Pede confirmação e remove o atleta correspondente do sistema.
   */
  async excluirAtleta(id: number | undefined): Promise<void> {
    if (!id) return;

    const atleta = this.atletas.find(item => item.id === id);
    if (!atleta) return;

    const confirmar = confirm(`Deseja realmente excluir "${atleta.nome}"?`);
    if (!confirmar) return;

    try {
      await this.pessoaService.excluir(id);

      // Remove o item excluído da lista local
      this.atletas = this.atletas.filter(item => item.id !== id);
      alert('Atleta excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir atleta.');
    }
  }
}