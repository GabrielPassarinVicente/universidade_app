import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  mensagemErro: string = '';
  carregando: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.carregando = true;
      this.mensagemErro = '';

      const credentials = {
        email: this.loginForm.value.email || '',
        password: this.loginForm.value.password || ''
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.carregando = false;
          this.router.navigate(['/alunos']);
        },
        error: (erro) => {
          this.carregando = false;
          console.error('Erro no login:', erro);
          this.mensagemErro = 'Email ou senha inválidos. Tente novamente.';
        }
      });
    } else {
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}