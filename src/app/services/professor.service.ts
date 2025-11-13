import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

export interface Professor {
  id: number;
  nome: string;
  email: string;
  departamento: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  
private apiUrl = `${environment.apiUrl}/cursos`;
  constructor(private http: HttpClient) {}

  listar(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.apiUrl}/${id}`);
  }

  criar(professor: Professor): Observable<Professor> {
    return this.http.post<Professor>(this.apiUrl, professor);
  }

  atualizar(professor: Professor): Observable<Professor> {
    return this.http.put<Professor>(`${this.apiUrl}/${professor.id}`, professor);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
