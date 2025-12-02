import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AlunoComponent } from './aluno/aluno.component';
import { ProfessorComponent } from './professor/professor.component';
import { CursoComponent } from './curso/curso.component';
import { authGuard } from './guards/auth.guard';
import { DepartamentoComponent } from './departamento/departamento.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'alunos', component: AlunoComponent, canActivate: [authGuard] },
  { path: 'professores', component: ProfessorComponent, canActivate: [authGuard] },
  { path: 'cursos', component: CursoComponent, canActivate: [authGuard] },
  { path: 'departamentos', component: DepartamentoComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];