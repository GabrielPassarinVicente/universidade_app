import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../curso/curso.component';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

private apiUrl = `${environment.apiUrl}/cursos`;
  constructor(private http: HttpClient) { }

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  criar(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso);
  }

  atualizar(curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/${curso.id}`, curso);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}