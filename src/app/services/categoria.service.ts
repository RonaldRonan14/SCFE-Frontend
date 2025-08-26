import { Injectable } from '@angular/core';
import { environment } from '../../env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaAdicionar, CategoriaAtualizar } from '../models/categoria.model';
import { Paginacao } from '../models/paginacao.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private urlApi = `${environment.apiUrl}/categorias`

  constructor(private http: HttpClient) { }

  GetAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlApi);
  }

  GetPagination(page: number, pageSize: number): Observable<Paginacao<Categoria>> {
    return this.http.get<Paginacao<Categoria>>(`${this.urlApi}/paginado?page=${page}&pageSize=${pageSize}`)
  }

  GetById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.urlApi}/${id}`);
  }

  Add(categoria: CategoriaAdicionar): Observable<Categoria> {
    return this.http.post<Categoria>(this.urlApi, categoria);
  }

  Update(id: string, categoria: CategoriaAtualizar): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.urlApi}/${id}`, categoria);
  }
}
