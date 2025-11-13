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
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    departamento: new FormControl('', Validators.required)
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
    this.idEmEdicao = professor.id;

    this.formulario.setValue({
      nome: professor.nome,
      email: professor.email,
      departamento: professor.departamento
    });
  }
  salvar() {
    if (this.formulario.valid) {
      const dados = this.formulario.value;
      
      const professorParaSalvar: Professor = {
        id: this.idEmEdicao ? this.idEmEdicao : 0,
        nome: dados.nome || '',
        email: dados.email || '',
        departamento: dados.departamento || ''
      };

      if (this.idEmEdicao !== null) {
        this.professorService.atualizar(professorParaSalvar).subscribe(() => {
          this.carregarProfessores();
          this.mostrarFormulario = false;
          this.idEmEdicao = null;
          alert('Professor atualizado com sucesso!');
        });
      } else {
        this.professorService.criar(professorParaSalvar).subscribe(() => {
          this.carregarProfessores();
          this.mostrarFormulario = false;
          alert('Professor salvo com sucesso!');
        });
      }
    } else {
      alert('Preencha todos os campos!');
    }
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja deletar este professor?')) {
      this.professorService.deletar(id).subscribe(() => {
        this.carregarProfessores();
        alert('Professor deletado com sucesso!');
      });
    }
  }
}