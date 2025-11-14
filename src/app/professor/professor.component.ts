import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfessorService, Professor } from '../services/professor.service';

@Component({
  selector: 'app-professor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class ProfessorComponent {
idEmEdicao: number | null = null;

  mostrarFormulario = false;

  constructor(private professorService: ProfessorService) {}

  ngOnInit() {
    this.carregarProfessores();
  }

  carregarProfessores() {
    this.professorService.listar().subscribe({
      next: (dados) => {
        this.listaProfessores = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar professores', erro);
      }
    });
  }

  formulario = new FormGroup({
    nome: new FormControl('', Validators.required)
  });

  listaProfessores: Professor[] = [];

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.idEmEdicao = null;
    this.formulario.reset();
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.idEmEdicao = null;
  }

editar(professor: Professor) {
    this.mostrarFormulario = true;
    this.idEmEdicao = professor.idProfessores;

    this.formulario.setValue({
      nome: professor.nome
    });
  }
  salvar() {
    if (this.formulario.valid) {
      const dados = this.formulario.value;
      
      const professorParaSalvar: Professor = {
        idProfessores: this.idEmEdicao ? this.idEmEdicao : 0,
        nome: dados.nome || ''
      };

      if (this.idEmEdicao !== null) {
        this.professorService.atualizar(professorParaSalvar).subscribe({
          next: () => {
            this.carregarProfessores();
            this.mostrarFormulario = false;
            this.idEmEdicao = null;
            alert('Professor atualizado com sucesso!');
          },
          error: (erro) => {
            console.error('Erro ao atualizar professor', erro);
            alert('Erro ao atualizar professor: ' + (erro.error?.message || erro.message));
          }
        });
      } else {
        this.professorService.criar(professorParaSalvar).subscribe({
          next: () => {
            this.carregarProfessores();
            this.mostrarFormulario = false;
            alert('Professor salvo com sucesso!');
          },
          error: (erro) => {
            console.error('Erro ao criar professor', erro);
            alert('Erro ao criar professor: ' + (erro.error?.message || erro.message));
          }
        });
      }
    } else {
      alert('Preencha todos os campos!');
    }
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja deletar este professor?')) {
      this.professorService.deletar(id).subscribe({
        next: () => {
          this.carregarProfessores();
          alert('Professor deletado com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao deletar professor', erro);
          let mensagemErro = 'Erro desconhecido ao deletar professor';
          
          if (erro.status === 500) {
            mensagemErro = 'Não é possível deletar este professor pois ele está vinculado a cursos ou outras entidades. Remova os vínculos primeiro.';
          } else if (erro.error?.message) {
            mensagemErro = erro.error.message;
          } else if (erro.message) {
            mensagemErro = erro.message;
          }
          
          alert('Erro ao deletar professor: ' + mensagemErro);
        }
      });
    }
  }
}