import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RelatorioFiltro, RelatorioPorCategoria, RelatorioResumo } from '../models/relatorio.model';
import { Observable } from 'rxjs';
import { formatarData } from '../util/formatacao-api';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private urlApi = `${environment.apiUrl}/relatorios`

  constructor(private http: HttpClient) { }

  GetSummaryReport(relatorioFiltro: RelatorioFiltro): Observable<RelatorioResumo> {
    let params = new HttpParams()
      .set('datainicio', formatarData(relatorioFiltro.datainicio))
      .set('datafim', formatarData(relatorioFiltro.datafim));

    return this.http.get<RelatorioResumo>(`${this.urlApi}/resumo`, { params: params })
  }

  GetReportByCategoria(relatorioFiltro: RelatorioFiltro): Observable<RelatorioPorCategoria[]> {
    let params = new HttpParams()
      .set('datainicio', formatarData(relatorioFiltro.datainicio))
      .set('datafim', formatarData(relatorioFiltro.datafim));

    return this.http.get<RelatorioPorCategoria[]>(`${this.urlApi}/por-categoria`, { params: params })
  }
}
