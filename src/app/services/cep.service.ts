import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Estrutura de dados retornada pela API do ViaCEP
export interface Endereco {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root' 
})

export class CepService {
  // URL do ViaCEP
  private apiUrl = 'https://viacep.com.br/ws';

  constructor(private http: HttpClient) {}

  // Faz a consulta HTTP GET para buscar os dados do endereço pelo CEP
  buscarCep(cep: string): Observable<Endereco> {
    return this.http.get<Endereco>(`${this.apiUrl}/${cep}/json/`);
  }
}