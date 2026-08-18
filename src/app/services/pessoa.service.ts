import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Atleta {
  id?: number;
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

  private tabela = 'atletas';

  constructor(private supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  // CADASTRAR
  async adicionar(atleta: Atleta): Promise<Atleta> {

    const { data, error } = await this.supabase
      .from(this.tabela)
      .insert({
        nome: atleta.nome,
        cpf: atleta.cpf.replace(/\D/g, ''),
        sexo: atleta.sexo,
        cep: atleta.cep,
        logradouro: atleta.logradouro,
        bairro: atleta.bairro,
        cidade: atleta.cidade,
        uf: atleta.uf
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // LISTAR
  async listar(): Promise<Atleta[]> {

    const { data, error } = await this.supabase
      .from(this.tabela)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return data ?? [];
  }

  // BUSCAR POR ID
  async buscarPorId(id: number): Promise<Atleta | null> {

    const { data, error } = await this.supabase
      .from(this.tabela)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  // BUSCAR POR CPF
  async buscarPorCpf(cpf: string): Promise<Atleta | null> {

    const cpfLimpo = cpf.replace(/\D/g, '');

    const { data, error } = await this.supabase
      .from(this.tabela)
      .select('*')
      .eq('cpf', cpfLimpo)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  // ATUALIZAR
  async atualizar(atleta: Atleta): Promise<Atleta> {

    if (!atleta.id) {
      throw new Error('ID do atleta não informado.');
    }

    const { data, error } = await this.supabase
      .from(this.tabela)
      .update({
        nome: atleta.nome,
        cpf: atleta.cpf.replace(/\D/g, ''),
        sexo: atleta.sexo,
        cep: atleta.cep,
        logradouro: atleta.logradouro,
        bairro: atleta.bairro,
        cidade: atleta.cidade,
        uf: atleta.uf
      })
      .eq('id', atleta.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // EXCLUIR
  async excluir(id: number): Promise<void> {

    const { error } = await this.supabase
      .from(this.tabela)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}