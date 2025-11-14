import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../enviroments/enviroments';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
private apiUrl = `${environment.apiUrl}/api/auth`;
  private tokenKey = 'auth_token';
  private usuarioKey = 'auth_usuario';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('=== TENTANDO LOGIN ===');
    console.log('URL da API:', `${this.apiUrl}/login`);
    console.log('Credenciais:', credentials);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login bem-sucedido!', response);
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.usuarioKey, JSON.stringify({
            username: response.username,
            email: response.email,
            expiration: response.expiration
          }));
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
