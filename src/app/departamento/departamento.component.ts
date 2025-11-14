import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { DepartamentoService, Departamento } from '../services/departamento.service';

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent {
  mostrarFormulario = false;
  idEmEdicao: number | null = null;

  formulario = new FormGroup({
    nome: new FormControl('', Validators.required),
    codigo: new FormControl(''),
    descricao: new FormControl('')
  });

  listaDepartamentos: Departamento[] = [];

  constructor(private departamentoService: DepartamentoService) {
    this.carregar();
  }

  carregar() {
    this.listaDepartamentos = this.departamentoService.listar();
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
    this.idEmEdicao = null;
    this.formulario.reset();
  }

  cancelar() {
    this.mostrarFormulario = false;
    this.idEmEdicao = null;
  }

  edita(depto: Departamento) {
    this.mostrarFormulario = true;
    this.idEmEdicao = depto.id;
    this.formulario.setValue({ nome: depto.nome || '', codigo: depto.codigo || '', descricao: depto.descricao || '' });
  }

  salvar() {
    if (!this.formulario.valid) {
      alert('Preencha o nome do departamento.');
      return;
    }

    const vals = this.formulario.value;

    if (this.idEmEdicao) {
      const atualizado: Departamento = {
        id: this.idEmEdicao,
        nome: vals.nome || '',
        codigo: vals.codigo || undefined,
        descricao: vals.descricao || undefined,
        dataCriacao: new Date().toISOString()
      };
      const res = this.departamentoService.atualizar(atualizado);
      if (res) {
        alert('Departamento atualizado com sucesso');
      } else {
        alert('Erro ao atualizar departamento');
      }
    } else {
      const criado = this.departamentoService.criar({
        nome: vals.nome || '',
        codigo: vals.codigo || undefined,
        descricao: vals.descricao || undefined,
        dataCriacao: new Date().toISOString()
      });
      if (criado) {
        alert('Departamento criado com sucesso');
      }
    }

    this.carregar();
    this.cancelar();
  }

  deletar(id: number) {
    if (!confirm('Deseja excluir este departamento?')) return;
    const ok = this.departamentoService.deletar(id);
    if (ok) {
      this.carregar();
      alert('Departamento excluído');
    } else {
      alert('Erro ao excluir departamento');
    }
  }
}
