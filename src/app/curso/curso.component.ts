import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService, Departamento } from '../services/departamento.service';
import { CursoService } from '../services/cursos.service';

export interface Curso {
  id: number;
  nome: string;
  cargaHoraria: string;
  departamentoId: number;
}

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent {

  mostrarFormulario = false;
  idEmEdicao: number | null = null;
  listaDepartamentos: Departamento[] = [];

  formulario = new FormGroup({
    nome: new FormControl('', Validators.required),
    cargaHoraria: new FormControl('', Validators.required),
    departamentoId: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  });

  listaCursos: Curso[] = [];

  constructor(
    private departamentoService: DepartamentoService,
    private cursoService: CursoService
  ) {
    this.listaDepartamentos = this.departamentoService.getDepartamentos();
  }

  ngOnInit() {
    this.carregarCursos();
  }

  carregarCursos() {
    this.cursoService.listar().subscribe({
      next: (dados) => {
        this.listaCursos = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar cursos', erro);
      }
    });
  }

  salvar() {
    if (this.formulario.valid) {
      const dados = this.formulario.value;
      
      const cursoParaSalvar: Curso = {
        id: this.idEmEdicao ? this.idEmEdicao : 0,
        nome: dados.nome || '',
        cargaHoraria: dados.cargaHoraria || '',
        departamentoId: dados.departamentoId || 0
      };

      if (this.idEmEdicao) {
        this.cursoService.atualizar(cursoParaSalvar).subscribe(() => {
          this.carregarCursos();
          this.mostrarFormulario = false;
          this.idEmEdicao = null;
          alert('Atualizado com sucesso!');
        });
      } else {
        this.cursoService.criar(cursoParaSalvar).subscribe(() => {
          this.carregarCursos();
          this.mostrarFormulario = false;
          alert('Criado com sucesso!');
        });
      }
    }
  }

  deletar(id: number) {
    if(confirm('Deseja excluir?')) {
      this.cursoService.deletar(id).subscribe(() => {
        this.carregarCursos();
      });
    }
  }

  getNomeDepartamento(id: number): string {
    return this.departamentoService.getNomeDepartamento(id);
  }
   abrirFormulario() {
    this.mostrarFormulario = true;
    this.idEmEdicao = null;
    this.formulario.reset();
  }

  edita(curso: Curso) {
    this.mostrarFormulario = true;
    this.idEmEdicao = curso.id;

    this.formulario.setValue({
      nome: curso.nome,
      cargaHoraria: curso.cargaHoraria,
      departamentoId: curso.departamentoId
    });
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.idEmEdicao = null;
  }
}