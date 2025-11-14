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
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    console.log('=== FORMULÁRIO SUBMETIDO ===');
    console.log('Formulário válido:', this.loginForm.valid);
    console.log('Valores do formulário:', this.loginForm.value);
    
    if (this.loginForm.valid) {
      this.carregando = true;
      this.mensagemErro = '';

      const credentials = {
        username: this.loginForm.value.username || '',
        password: this.loginForm.value.password || ''
      };

      console.log('Chamando serviço de login...');
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login realizado com sucesso!');
          this.carregando = false;
          this.router.navigate(['/alunos']);
        },
        error: (erro) => {
          this.carregando = false;
          console.error('=== ERRO NO LOGIN ===');
          console.error('Status:', erro.status);
          console.error('Mensagem:', erro.message);
          console.error('Erro completo:', erro);
          
          if (erro.status === 0) {
            this.mensagemErro = 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';
          } else if (erro.status === 401) {
            this.mensagemErro = 'Email ou senha inválidos.';
          } else {
            this.mensagemErro = `Erro ao fazer login: ${erro.message}`;
          }
        }
      });
    } else {
      console.log('Formulário inválido');
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
    }
  }
}