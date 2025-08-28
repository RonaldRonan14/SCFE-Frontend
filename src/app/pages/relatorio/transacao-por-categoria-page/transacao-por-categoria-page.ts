import { Component, OnInit } from '@angular/core';
import { RelatorioFiltro, RelatorioPorCategoria } from '../../../models/relatorio.model';
import { RelatorioService } from '../../../services/relatorio.service';
import Swal from 'sweetalert2';
import { getDescricaoTipo } from '../../../enums/tipo-categoria.enum';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-transacao-por-categoria-page',
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './transacao-por-categoria-page.html',
  styleUrl: './transacao-por-categoria-page.scss'
})
export class TransacaoPorCategoriaPage implements OnInit {
  relatorioTransacaoPorCategoria!: RelatorioPorCategoria[];
  filtro: RelatorioFiltro = {
    datainicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    datafim: new Date(),
  }

  constructor(
    private relatorioService: RelatorioService
  ) { }

  ngOnInit(): void {
    this.carregarRelatorioTransacaoPorCategoria();
  }

  filtroDatainicio(dataString: string): void {
    if (dataString.length === 0) {
      this.filtro.datainicio = new Date(new Date().getFullYear(), 0, 1)
      this.carregarRelatorioTransacaoPorCategoria();
      return;
    }

    const partesDaData = dataString.split('-').map(Number);
    const data = new Date(partesDaData[0], partesDaData[1] - 1, partesDaData[2]);

    if (this.filtro.datafim && data > this.filtro.datafim) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'A data de inicio não pode ser maior que a data final'
      });
      return;
    }

    this.filtro.datainicio = data;
    this.carregarRelatorioTransacaoPorCategoria();
  }

  filtroDataFim(dataString: string): void {
    if (dataString.length === 0) {
      this.filtro.datafim = new Date()
      this.carregarRelatorioTransacaoPorCategoria();
      return;
    }

    const partesDaData = dataString.split('-').map(Number);
    const data = new Date(partesDaData[0], partesDaData[1] - 1, partesDaData[2]);

    if (this.filtro.datainicio && data < this.filtro.datainicio) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'A data de final não pode ser menor que a data inicial'
      });
      return;
    }

    this.filtro.datafim = data;
    this.carregarRelatorioTransacaoPorCategoria();
  }

  getDescricaoTipo(tipo: number): string {
    return getDescricaoTipo(tipo)
  }

  private carregarRelatorioTransacaoPorCategoria(): void {
    this.relatorioService.GetReportByCategoria(this.filtro).subscribe({
      next: (dados: RelatorioPorCategoria[]) => {
        this.relatorioTransacaoPorCategoria = dados;
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao obter o relatório de resumo.',
          text: err.message || err.error || 'Ocorreu um erro desconhecido. Tente novamente.'
        });
      }
    })
  }
}
