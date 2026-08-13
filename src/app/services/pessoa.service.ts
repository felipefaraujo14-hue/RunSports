import { Injectable } from '@angular/core';

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

  private chave = 'atletas';

  constructor() {}

  adicionar(atleta: Atleta): void {
    const atletas = this.listar();

    atletas.push(atleta);

    localStorage.setItem(
      this.chave,
      JSON.stringify(atletas)
    );
  }

  listar(): Atleta[] {
    const dados = localStorage.getItem(this.chave);

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);
  }

  buscarPorId(id: number): Atleta | undefined {
    return this.listar().find(
      atleta => atleta.id === id
    );
  }

  buscarPorCpf(cpf: string): Atleta | undefined {
    const cpfLimpo = cpf.replace(/\D/g, '');

    return this.listar().find(
      atleta => atleta.cpf.replace(/\D/g, '') === cpfLimpo
    );
  }

  atualizar(atletaAtualizado: Atleta): void {
    const atletas = this.listar();

    const index = atletas.findIndex(
      atleta => atleta.id === atletaAtualizado.id
    );

    if (index !== -1) {
      atletas[index] = atletaAtualizado;

      localStorage.setItem(
        this.chave,
        JSON.stringify(atletas)
      );
    }
  }

  excluir(id: number): void {
    const atletas = this.listar().filter(
      atleta => atleta.id !== id
    );

    localStorage.setItem(
      this.chave,
      JSON.stringify(atletas)
    );
  }
}