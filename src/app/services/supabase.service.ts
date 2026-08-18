import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {

    // Inicializa a conexao com o supabase usando url e chave publica
    this.supabase = createClient(
      'https://zcbvmtikufptwjkoradg.supabase.co',
      'sb_publishable_bv1zQonUOb5ORH66J4aSmA_VGO6PVAS'
    );
  }

  // Retorna a instância ativa do cliente Supabase para ser utilzada em outros serviços.
  getClient(): SupabaseClient {
    return this.supabase;
  }
}