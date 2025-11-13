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
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    curso: new FormControl('', Validators.required)
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
        nome: dados.nome || '',
        email: dados.email || '',
        curso: dados.curso || ''
      };

      if (this.idEmEdicao !== null) {
        this.alunoService.atualizar(alunoParaSalvar).subscribe(() => {
          this.carregarAlunos();
          this.mostrarFormulario = false;
          this.idEmEdicao = null;
          alert('Aluno atualizado com sucesso!');
        });
      } else {
        this.alunoService.criar(alunoParaSalvar).subscribe(() => {
          this.carregarAlunos();
          this.mostrarFormulario = false;
          alert('Aluno salvo com sucesso!');
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
      nome: aluno.nome,
      email: aluno.email,
      curso: aluno.curso
    });
  }
  deletarAluno(id: number) {
    if (confirm('Tem certeza que deseja deletar este aluno?')) {
      this.alunoService.deletar(id).subscribe(() => {
        this.carregarAlunos();
        alert('Aluno deletado com sucesso!');
      });
    }
  }
}