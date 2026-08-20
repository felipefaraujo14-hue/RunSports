import { Routes } from '@angular/router';

import { CadastroAtleta } from './cadastro-atleta/cadastro-atleta';
import { CadastroCorrida } from './cadastro-corrida/cadastro-corrida';
import { CorridasDisponiveis } from './corridas-disponiveis/corridas-disponiveis';
import { InscricaoCorrida } from './inscricao-corrida/inscricao-corrida';
import { ListaAtleta } from './lista-atleta/lista-atleta';

export const routes: Routes = [

  // Página inicial
  {
    path: '',
    redirectTo: 'cadastro-atleta',
    pathMatch: 'full'
  },

  // Cadastro de atleta
  {
    path: 'cadastro-atleta',
    component: CadastroAtleta
  },

  // Edição de atleta
  {
    path: 'cadastro-atleta/:id',
    component: CadastroAtleta
  },

  // Cadastro de corrida
  {
    path: 'cadastro-corrida',
    component: CadastroCorrida
  },

  // Corridas disponíveis
  {
    path: 'corrida-disponivel',
    component: CorridasDisponiveis
  },

  // Inscrição em corrida
  {
    path: 'inscricao-corrida',
    component: InscricaoCorrida
  },

  // Lista de atletas
  {
    path: 'lista-atleta',
    component: ListaAtleta
  },

  // Qualquer rota inexistente
  {
    path: '**',
    redirectTo: 'cadastro-atleta'
  }

];