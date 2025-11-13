import { Injectable } from '@angular/core';

export interface Departamento {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
  
  private departamentos: Departamento[] = [
    { id: 1, nome: 'Exatas' },
    { id: 2, nome: 'Humanas' },
    { id: 3, nome: 'Biológicas' },
    { id: 4, nome: 'Tecnologia' },
    { id: 5, nome: 'Artes' }
  ];

  getDepartamentos(): Departamento[] {
    return this.departamentos;
  }

  getNomeDepartamento(id: number): string {
    const depto = this.departamentos.find(d => d.id === id);
    return depto ? depto.nome : 'Desconhecido';
  }
}
