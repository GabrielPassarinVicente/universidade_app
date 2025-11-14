import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlunoService, Aluno } from '../services/aluno.service';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.css'
})

export class AlunoComponent {
mostrarFormulario = false;
idEmEdicao: number | null = null;

  constructor(private alunoService: AlunoService) {}

  ngOnInit() {
    this.carregarAlunos();
  }

  carregarAlunos() {
    this.alunoService.listar().subscribe({
      next: (dados) => {
        this.listaAlunos = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar alunos', erro);
      }
    });
  }

  alunoForm = new FormGroup({
    nomeCompleto: new FormControl('', Validators.required),
    dataNascimento: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    endereco: new FormControl('', Validators.required),
    telefone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  listaAlunos: Aluno[] = [];

  exibirFormulario() {
    this.mostrarFormulario = true;
    this.idEmEdicao = null; 
    this.alunoForm.reset(); 
  }

  salvarAluno() {
    if (this.alunoForm.valid) {
      const dados = this.alunoForm.value;
      
      const alunoParaSalvar: Aluno = {
        id: this.idEmEdicao ? this.idEmEdicao : 0,
        nomeCompleto: dados.nomeCompleto || '',
        dataNascimento: dados.dataNascimento || '',
        cpf: dados.cpf || '',
        endereco: dados.endereco || '',
        telefone: dados.telefone || '',
        email: dados.email || '',
        dataMatricula: new Date().toISOString()
      };

      if (this.idEmEdicao !== null) {
        this.alunoService.atualizar(alunoParaSalvar).subscribe({
          next: () => {
            this.carregarAlunos();
            this.mostrarFormulario = false;
            this.idEmEdicao = null;
            alert('Aluno atualizado com sucesso!');
          },
          error: (erro) => {
            console.error('Erro ao atualizar aluno', erro);
            alert('Erro ao atualizar aluno: ' + (erro.error?.message || erro.message));
          }
        });
      } else {
        this.alunoService.criar(alunoParaSalvar).subscribe({
          next: () => {
            this.carregarAlunos();
            this.mostrarFormulario = false;
            alert('Aluno salvo com sucesso!');
          },
          error: (erro) => {
            console.error('Erro ao criar aluno', erro);
            alert('Erro ao criar aluno: ' + (erro.error?.message || erro.message));
          }
        });
      }
    } else {
      alert('Preencha todos os campos!');
    }
  }
  cancelar() {
    this.mostrarFormulario = false;
    this.idEmEdicao = null;
  }

  editar(aluno: Aluno) {
    this.mostrarFormulario = true;
    this.idEmEdicao = aluno.id;

    this.alunoForm.setValue({
      nomeCompleto: aluno.nomeCompleto,
      dataNascimento: aluno.dataNascimento.split('T')[0],
      cpf: aluno.cpf,
      endereco: aluno.endereco,
      telefone: aluno.telefone,
      email: aluno.email
    });
  }
  deletarAluno(id: number) {
    if (confirm('Tem certeza que deseja deletar este aluno?')) {
      this.alunoService.deletar(id).subscribe({
        next: () => {
          this.carregarAlunos();
          alert('Aluno deletado com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao deletar aluno', erro);
          let mensagemErro = 'Erro desconhecido ao deletar aluno';
          
          if (erro.status === 500) {
            mensagemErro = 'Não é possível deletar este aluno pois ele está vinculado a cursos ou outras entidades. Remova os vínculos primeiro.';
          } else if (erro.error?.message) {
            mensagemErro = erro.error.message;
          } else if (erro.message) {
            mensagemErro = erro.message;
          }
          
          alert('Erro ao deletar aluno: ' + mensagemErro);
        }
      });
    }
  }
}