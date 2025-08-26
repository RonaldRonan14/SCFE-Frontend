import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Transacao, TransacaoAdicionar, TransacaoAtualizar, TransacaoFiltro } from '../models/transacao.model';
import { Observable } from 'rxjs';
import { Paginacao } from '../models/paginacao.model';
import { formatarData } from '../util/formatacao-api';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  private urlApi = `${environment.apiUrl}/transacoes`

  constructor(private http: HttpClient) { }

  GetPagination(transacaoFiltro: TransacaoFiltro, page: number, pageSize: number): Observable<Paginacao<Transacao>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (transacaoFiltro.datainicio) {
      params = params.set('datainicio', formatarData(transacaoFiltro.datainicio));
    }
    
    if (transacaoFiltro.datafim) {
      params = params.set('datafim', formatarData(transacaoFiltro.datafim));
    }
    if (transacaoFiltro.categoriaid) {
      params = params.set('categoriaid', transacaoFiltro.categoriaid);
    }
    
    if (transacaoFiltro.tipo) {
      params = params.set('tipo', transacaoFiltro.tipo.toString());
    }

    return this.http.get<Paginacao<Transacao>>(`${this.urlApi}`, { params: params })
  }

  GetById(id: string): Observable<Transacao> {
    return this.http.get<Transacao>(`${this.urlApi}/${id}`);
  }

  Add(transacao: TransacaoAdicionar): Observable<Transacao> {
    return this.http.post<Transacao>(this.urlApi, transacao);
  }

  Update(id: string, transacao: TransacaoAtualizar): Observable<Transacao> {
    return this.http.put<Transacao>(`${this.urlApi}/${id}`, transacao);
  }

  Remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }
}
