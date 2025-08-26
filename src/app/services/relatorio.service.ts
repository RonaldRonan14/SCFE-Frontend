import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { HttpClient } from '@angular/common/http';
import { RelatorioFiltro, RelatorioPorCategoria, RelatorioResumo } from '../models/relatorio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private urlApi = `${environment.apiUrl}/relatorios`

  constructor(private http: HttpClient) { }

  GetSummaryReport(relatorioFiltro: RelatorioFiltro): Observable<RelatorioResumo> {
    return this.http.get<RelatorioResumo>(`${this.urlApi}/resumo?datainicio=${relatorioFiltro.datainicio}&datafim=${relatorioFiltro.datafim}`)
  }

  GetReportByCategoria(relatorioFiltro: RelatorioFiltro): Observable<RelatorioPorCategoria> {
    return this.http.get<RelatorioPorCategoria>(`${this.urlApi}/por-categoria?datainicio=${relatorioFiltro.datainicio}&datafim=${relatorioFiltro.datafim}`)
  }
}
