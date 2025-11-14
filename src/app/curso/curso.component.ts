import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService, Departamento } from '../services/departamento.service';
import { CursoService, Curso } from '../services/cursos.service';

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
    departamentos_idDepartamentos: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
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
      
      const departamentoId = Number(dados.departamentos_idDepartamentos);
      
      const cursoParaSalvar: Curso = {
        idCursos: this.idEmEdicao ? this.idEmEdicao : 0,
        nome: dados.nome || '',
        cargaHoraria: dados.cargaHoraria || '',
        departamentos_idDepartamentos: departamentoId
      };

      console.log('=== SALVANDO CURSO ===');
      console.log('Dados do formulário:', dados);
      console.log('Curso a salvar:', cursoParaSalvar);
      console.log('Tipo do departamentoId:', typeof cursoParaSalvar.departamentos_idDepartamentos);
      console.log('Modo edição?', !!this.idEmEdicao);

      if (this.idEmEdicao) {
        this.cursoService.atualizar(cursoParaSalvar).subscribe({
          next: () => {
            this.carregarCursos();
            this.mostrarFormulario = false;
            this.idEmEdicao = null;
            alert('Curso atualizado com sucesso!');
          },
          error: (erro) => {
            console.error('Erro ao atualizar curso', erro);
            console.error('Detalhes do erro:', erro.error);
            
            let mensagemErro = 'Erro desconhecido ao atualizar curso';
            
            if (erro.status === 500) {
              mensagemErro = 'Erro interno no servidor. Verifique se todos os campos estão corretos e se o departamento existe.';
            } else if (erro.status === 400) {
              mensagemErro = 'Dados inválidos. Verifique os campos do formulário.';
            } else if (erro.error?.message) {
              mensagemErro = erro.error.message;
            } else if (erro.message) {
              mensagemErro = erro.message;
            }
            
            alert('Erro ao atualizar curso: ' + mensagemErro);
          }
        });
      } else {
        this.cursoService.criar(cursoParaSalvar).subscribe({
          next: () => {
            this.carregarCursos();
            this.mostrarFormulario = false;
            alert('Curso criado com sucesso!');
          },
          error: (erro) => {
            console.error('Erro ao criar curso', erro);
            console.error('Detalhes do erro:', erro.error);
            
            let mensagemErro = 'Erro desconhecido ao criar curso';
            
            if (erro.status === 500) {
              mensagemErro = 'Erro interno no servidor. Verifique se todos os campos estão corretos e se o departamento existe.';
            } else if (erro.status === 400) {
              mensagemErro = 'Dados inválidos. Verifique os campos do formulário.';
            } else if (erro.error?.message) {
              mensagemErro = erro.error.message;
            } else if (erro.message) {
              mensagemErro = erro.message;
            }
            
            alert('Erro ao criar curso: ' + mensagemErro);
          }
        });
      }
    } else {
      console.log('Formulário inválido:', this.formulario.errors);
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  deletar(id: number) {
    if(confirm('Deseja excluir?')) {
      this.cursoService.deletar(id).subscribe({
        next: () => {
          this.carregarCursos();
          alert('Curso deletado com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao deletar curso', erro);
          let mensagemErro = 'Erro desconhecido ao deletar curso';
          
          if (erro.status === 500) {
            mensagemErro = 'Não é possível deletar este curso pois ele está vinculado a alunos, professores ou outras entidades. Remova os vínculos primeiro.';
          } else if (erro.error?.message) {
            mensagemErro = erro.error.message;
          } else if (erro.message) {
            mensagemErro = erro.message;
          }
          
          alert('Erro ao deletar curso: ' + mensagemErro);
        }
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
    console.log('=== EDITANDO CURSO ===');
    console.log('Curso selecionado:', curso);
    
    this.mostrarFormulario = true;
    this.idEmEdicao = curso.idCursos;

    this.formulario.setValue({
      nome: curso.nome,
      cargaHoraria: curso.cargaHoraria,
      departamentos_idDepartamentos: curso.departamentos_idDepartamentos
    });
    
    console.log('Valores no formulário após carregar:', this.formulario.value);
    console.log('Formulário válido?', this.formulario.valid);
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.idEmEdicao = null;
  }
}