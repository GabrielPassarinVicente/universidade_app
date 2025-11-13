import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroments';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
private apiUrl = `${environment.apiUrl}/cursos`;
  private tokenKey = 'auth_token';
  private usuarioKey = 'auth_usuario';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.usuarioKey, JSON.stringify(response.usuario));
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsuario(): any {
    const usuario = localStorage.getItem(this.usuarioKey);
    return usuario ? JSON.parse(usuario) : null;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
