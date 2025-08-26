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

  setToken(token: Token): void {
    localStorage.setItem('accessToken', token.token);
    localStorage.setItem('expiresIn', token.expiracao.toString());
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiresIn = localStorage.getItem('expiresIn');

    if (!token || !expiresIn) {
      return false;
    }

    const expires = new Date(expiresIn);
    return expires.getTime() > new Date().getTime();
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');
  }
}
