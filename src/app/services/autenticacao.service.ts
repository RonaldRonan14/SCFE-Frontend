import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { HttpClient } from '@angular/common/http';
import { Autenticacao, Token } from '../models/token.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private urlApi = `${environment.apiUrl}/auth`

  constructor(private http: HttpClient) { }

  ValidateCredentials(autenticacao: Autenticacao): Observable<Token> {
    return this.http.post<Token>(this.urlApi, autenticacao);
  }
}
