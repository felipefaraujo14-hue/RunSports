import { Routes } from '@angular/router';
import { CadastroAtleta } from './cadastro-atleta/cadastro-atleta';
import { CadastroCorrida } from './cadastro-corrida/cadastro-corrida';
import { CorridasDisponiveis } from './corridas-disponiveis/corridas-disponiveis';
import { InscricaoCorrida } from './inscricao-corrida/inscricao-corrida';
import { Component } from '../../node_modules/@angular/core/types/_debug_node-chunk';
import { ListaAtleta } from './lista-atleta/lista-atleta';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cadastro-atleta',
        pathMatch: 'full'
      },
    
      {
        path: 'cadastro-atleta',
        component: CadastroAtleta
      },
    
      {
        path: 'cadastro-corrida',
        component: CadastroCorrida
      },

      {
        path: 'corrida-disponivel',
        component: CorridasDisponiveis
      },

      {
        path: 'inscricao-corrida',
        component: InscricaoCorrida
      },

      {
        path: 'lista-atleta',
        component: ListaAtleta
      }
    
];



