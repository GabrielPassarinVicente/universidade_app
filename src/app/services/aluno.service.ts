import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

export interface Aluno {
    id: number;
    nomeCompleto: string;
    dataNascimento: string;
    cpf: string;
    endereco: string;
    telefone: string;
    email: string;
    dataMatricula: string;
}

@Injectable({
    providedIn: 'root'
})
export class AlunoService {

    private apiUrl = `${environment.apiUrl}/api/alunos`;
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

