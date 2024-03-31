import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent, TaskPageComponent } from './pages/_index';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Rota para a página inicial
  { path: 'new-task', component: TaskPageComponent }, // Rota para a página de criação de tarefas
  { path: 'edit-task/:id', component: TaskPageComponent }, // Rota para a página de edição de tarefas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
