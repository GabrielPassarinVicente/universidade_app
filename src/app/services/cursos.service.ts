import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

export interface Curso {
  idCursos: number;
  nome: string;
  cargaHoraria: string;
  departamentos_idDepartamentos: number;
  professores?: number[];
}

export interface UpdateCursoRequest {
  idCursos: number;
  nome: string;
  cargaHoraria: string;
  departamentos_idDepartamentos: number;
  professores?: number[];
}

export interface CreateCursoRequest {
  nome: string;
  cargaHoraria: string;
  departamentos_idDepartamentos: number;
  professores?: number[];
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

  criar(request: CreateCursoRequest): Observable<Curso> {
    console.log('📝 Criando curso:', request);
    console.log('Professores enviados:', request.professores, 'Tipos:', request.professores?.map(p => typeof p));
    return this.http.post<Curso>(this.apiUrl, request);
  }

  atualizar(request: UpdateCursoRequest): Observable<Curso> {
    console.log('📝 Atualizando curso:', request);
    console.log('Professores enviados:', request.professores, 'Tipos:', request.professores?.map(p => typeof p));
    console.log('🔗 URL da requisição:', `${this.apiUrl}/${request.idCursos}`);
    console.log('JSON que será enviado:', JSON.stringify(request));
    return this.http.put<Curso>(`${this.apiUrl}/${request.idCursos}`, request);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

