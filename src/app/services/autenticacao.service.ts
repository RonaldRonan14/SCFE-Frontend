import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../env/environment';
import { HttpClient } from '@angular/common/http';
import { Autenticacao, Token } from '../models/token.model';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  unique_name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private urlApi = `${environment.apiUrl}/auth`

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) { }

  ValidateCredentials(autenticacao: Autenticacao): Observable<Token> {
    return this.http.post<Token>(this.urlApi, autenticacao);
  }

  setToken(token: Token): void {
    localStorage.setItem('accessToken', token.token);
    localStorage.setItem('expiresIn', token.expiracao.toString());

    const decodedToken = jwtDecode<CustomJwtPayload>(token.token);

    if (decodedToken.unique_name) {
      localStorage.setItem('nomeUsuario', decodedToken.unique_name);
    }
    if (decodedToken.email) {
      localStorage.setItem('emailUsuario', decodedToken.email);
    }
  }

  getNomeUsuario(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('nomeUsuario');
    }
    return null;
  }

  getEmailUsuario(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('emailUsuario');
    }
    return null;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const expiresIn = localStorage.getItem('expiresIn');

      if (!token || !expiresIn) {
        return false;
      }

      const expires = new Date(expiresIn);
      return expires.getTime() > new Date().getTime();
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');

    this.router.navigate(['/login']);
  }
}
