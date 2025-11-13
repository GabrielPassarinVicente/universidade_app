import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

export interface Aluno {
    id: number;
    nome: string;
    email: string;
    curso: string;
}

@Injectable({
    providedIn: 'root'
})
export class AlunoService {

    private apiUrl = `${environment.apiUrl}/cursos`;
    constructor(private http: HttpClient) { }

    listar(): Observable<Aluno[]> {
        return this.http.get<Aluno[]>(this.apiUrl);
    }

    buscarPorId(id: number): Observable<Aluno> {
        return this.http.get<Aluno>(`${this.apiUrl}/${id}`);
    }

    criar(aluno: Aluno): Observable<Aluno> {
        return this.http.post<Aluno>(this.apiUrl, aluno);
    }

    atualizar(aluno: Aluno): Observable<Aluno> {
        return this.http.put<Aluno>(`${this.apiUrl}/${aluno.id}`, aluno);
    }

    deletar(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
