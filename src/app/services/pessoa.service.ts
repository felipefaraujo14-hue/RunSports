import { Injectable } from '@angular/core';

// Interface que define a estrutura de dados de um Atleta (Pessoa)
export interface Atleta {
  id: number;
  nome: string;
  cpf: string;
  sexo: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
}

@Injectable({
  providedIn: 'root' 
})
export class PessoaService {
  // Chave utilizada para armazenar e buscar os dados no LocalStorage
  private chave = 'atletas';

  constructor() {}

  /**
   * Adiciona um novo atleta ao LocalStorage.
   * @param atleta Objeto do tipo Atleta a ser cadastrado.
   */
  adicionar(atleta: Atleta): void {
    const atletas = this.listar();
    atletas.push(atleta);

    // Converte o array atualizado para JSON e salva no LocalStorage
    localStorage.setItem(this.chave, JSON.stringify(atletas));
  }

  /**
   * Recupera a lista de todos os atletas cadastrados.
   * @returns Array de atletas ou um array vazio caso não existam dados.
   */
  listar(): Atleta[] {
    const dados = localStorage.getItem(this.chave);

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);
  }

  /**
   * Busca um atleta específico através do seu ID.
   * @param id Identificador único do atleta.
   * @returns O atleta encontrado ou undefined se não existir.
   */
  buscarPorId(id: number): Atleta | undefined {
    return this.listar().find(atleta => atleta.id === id);
  }

  /**
   * Busca um atleta através do CPF (sanitiza a string removendo caracteres especiais).
   * @param cpf Número do CPF (formatado ou apenas dígitos).
   * @returns O atleta correspondente ou undefined.
   */
  buscarPorCpf(cpf: string): Atleta | undefined {
    // Remove qualquer caractere não numérico (pontos, hífens, etc.)
    const cpfLimpo = cpf.replace(/\D/g, '');

    return this.listar().find(
      atleta => atleta.cpf.replace(/\D/g, '') === cpfLimpo
    );
  }

  /**
   * Atualiza os dados de um atleta existente.
   * @param atletaAtualizado Objeto com os dados atualizados do atleta.
   */
  atualizar(atletaAtualizado: Atleta): void {
    const atletas = this.listar();

    // Localiza o índice do item no array pelo ID
    const index = atletas.findIndex(
      atleta => atleta.id === atletaAtualizado.id
    );

    // Se o item for encontrado, atualiza e persiste no LocalStorage
    if (index !== -1) {
      atletas[index] = atletaAtualizado;
      localStorage.setItem(this.chave, JSON.stringify(atletas));
    }
  }

  /**
   * Remove um atleta do LocalStorage pelo seu ID.
   * @param id Identificador único do atleta a ser removido.
   */
  excluir(id: number): void {
    // Filtra criando uma nova lista sem o atleta com o ID especificado
    const atletas = this.listar().filter(
      atleta => atleta.id !== id
    );

    // Persiste a lista atualizada
    localStorage.setItem(this.chave, JSON.stringify(atletas));
  }
}