import { Injectable } from '@angular/core';

export interface Departamento {
  id: number;
  nome: string;
  codigo?: string;
  descricao?: string;
  dataCriacao?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  private departamentos: Departamento[] = [
    { id: 1, nome: 'Exatas', codigo: 'EXA', descricao: 'Departamento de Ciências Exatas', dataCriacao: new Date().toISOString() },
    { id: 2, nome: 'Humanas', codigo: 'HUM', descricao: 'Departamento de Ciências Humanas', dataCriacao: new Date().toISOString() },
    { id: 3, nome: 'Biológicas', codigo: 'BIO', descricao: 'Departamento de Ciências Biológicas', dataCriacao: new Date().toISOString() },
    { id: 4, nome: 'Tecnologia', codigo: 'TEC', descricao: 'Departamento de Tecnologia', dataCriacao: new Date().toISOString() },
    { id: 5, nome: 'Artes', codigo: 'ART', descricao: 'Departamento de Artes', dataCriacao: new Date().toISOString() }
  ];

  listar(): Departamento[] {
    // Retorna cópia para evitar mutações externas acidentais
    return this.departamentos.map(d => ({ ...d }));
  }

  getDepartamentos(): Departamento[] {
    return this.listar();
  }

  getNomeDepartamento(id: number): string {
    const depto = this.departamentos.find(d => d.id === id);
    return depto ? depto.nome : 'Desconhecido';
  }

  criar(departamento: Omit<Departamento, 'id'>): Departamento {
    const novoId = this.departamentos.length ? Math.max(...this.departamentos.map(d => d.id)) + 1 : 1;
    const novo: Departamento = { id: novoId, ...departamento };
    this.departamentos.push(novo);
    return { ...novo };
  }

  atualizar(departamento: Departamento): Departamento | null {
    const idx = this.departamentos.findIndex(d => d.id === departamento.id);
    if (idx === -1) return null;
    this.departamentos[idx] = { ...departamento };
    return { ...this.departamentos[idx] };
  }

  deletar(id: number): boolean {
    const idx = this.departamentos.findIndex(d => d.id === id);
    if (idx === -1) return false;
    this.departamentos.splice(idx, 1);
    return true;
  }
}
