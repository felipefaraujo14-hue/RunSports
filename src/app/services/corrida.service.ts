import { Injectable } from '@angular/core';

// Interface que define a estrutura de dados de uma Corrida
export interface Corrida {
  id: number;
  descricao: string;
  data: string;
  distancias: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CorridaService {
  // Chave utilizada para armazenar e buscar os dados no LocalStorage
  private chave = 'corridas';

  constructor() {}

  /**
   * Adiciona uma nova corrida ao LocalStorage.
   * @param corrida Objeto do tipo Corrida a ser cadastrado.
   */
  adicionar(corrida: Corrida): void {
    const corridas = this.listar();
    corridas.push(corrida);

    // Converte o array atualizado para JSON e salva no LocalStorage
    localStorage.setItem(this.chave, JSON.stringify(corridas));
  }

  /**
   * Recupera a lista de todas as corridas cadastradas.
   * @returns Array de corridas ou um array vazio caso não existam dados.
   */
  listar(): Corrida[] {
    const dados = localStorage.getItem(this.chave);

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);
  }

  /**
   * Busca uma corrida específica através do seu ID.
   * @param id Identificador único da corrida.
   * @returns A corrida encontrada ou undefined se não existir.
   */
  buscarPorId(id: number): Corrida | undefined {
    const corridas = this.listar();
    return corridas.find(corrida => corrida.id === id);
  }

  /**
   * Atualiza os dados de uma corrida existente.
   * @param corridaAtualizada Objeto com os dados atualizados da corrida.
   */
  atualizar(corridaAtualizada: Corrida): void {
    const corridas = this.listar();

    // Localiza o índice do item no array
    const index = corridas.findIndex(
      corrida => corrida.id === corridaAtualizada.id
    );

    // Se o item for encontrado, atualiza e persiste no LocalStorage
    if (index !== -1) {
      corridas[index] = corridaAtualizada;
      localStorage.setItem(this.chave, JSON.stringify(corridas));
    }
  }

  /**
   * Remove uma corrida do LocalStorage pelo seu ID.
   * @param id Identificador único da corrida a ser removida.
   */
  excluir(id: number): void {
    const corridas = this.listar();

    // Filtra removendo o item com o ID correspondente
    const novasCorridas = corridas.filter(
      corrida => corrida.id !== id
    );

    // Persiste a nova lista sem a corrida excluída
    localStorage.setItem(this.chave, JSON.stringify(novasCorridas));
  }
}