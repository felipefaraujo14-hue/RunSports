import { Injectable } from '@angular/core';

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

  private chave = 'corridas';

  constructor() {}

  adicionar(corrida: Corrida): void {
    const corridas = this.listar();

    corridas.push(corrida);

    localStorage.setItem(
      this.chave,
      JSON.stringify(corridas)
    );
  }

  listar(): Corrida[] {
    const dados = localStorage.getItem(this.chave);

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);
  }

  buscarPorId(id: number): Corrida | undefined {
    const corridas = this.listar();

    return corridas.find(corrida => corrida.id === id);
  }

  atualizar(corridaAtualizada: Corrida): void {
    const corridas = this.listar();

    const index = corridas.findIndex(
      corrida => corrida.id === corridaAtualizada.id
    );

    if (index !== -1) {
      corridas[index] = corridaAtualizada;

      localStorage.setItem(
        this.chave,
        JSON.stringify(corridas)
      );
    }
  }

  excluir(id: number): void {
    const corridas = this.listar();

    const novasCorridas = corridas.filter(
      corrida => corrida.id !== id
    );

    localStorage.setItem(
      this.chave,
      JSON.stringify(novasCorridas)
    );
  }
}