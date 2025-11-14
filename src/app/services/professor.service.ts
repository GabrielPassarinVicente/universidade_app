import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

export interface Professor {
  idProfessores: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  
private apiUrl = `${environment.apiUrl}/api/professores`;
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
    return this.http.put<Professor>(`${this.apiUrl}/${professor.idProfessores}`, professor);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
