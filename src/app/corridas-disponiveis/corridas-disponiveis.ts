import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Corrida,
  CorridaService
} from '../services/corrida.service';

@Component({
  selector: 'app-corridas-disponiveis',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './corridas-disponiveis.html',
  styleUrl: './corridas-disponiveis.css'
})
export class CorridasDisponiveis implements OnInit {

  corridas: Corrida[] = [];

  constructor(
    private corridaService: CorridaService
  ) {}

  ngOnInit(): void {
    this.carregarCorridas();
  }

  carregarCorridas(): void {
    this.corridas = this.corridaService.listar();
  }
}