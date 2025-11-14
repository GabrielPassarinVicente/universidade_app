import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

export interface Curso {
  idCursos: number;
  nome: string;
  cargaHoraria: string;
  departamentos_idDepartamentos: number;
}

@Injectable({
  providedIn: 'root'
})
export class CursoService {

private apiUrl = `${environment.apiUrl}/api/cursos`;
  constructor(private http: HttpClient) { }

  listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  criar(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso);
  }

  atualizar(curso: Curso): Observable<Curso> {
    console.log('📝 Atualizando curso:', curso);
    console.log('🔗 URL da requisição:', `${this.apiUrl}/${curso.idCursos}`);
    return this.http.put<Curso>(`${this.apiUrl}/${curso.idCursos}`, curso);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}