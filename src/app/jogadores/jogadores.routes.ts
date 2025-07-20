import { Routes } from '@angular/router';

export const jogadoresRoutes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/jogadores',
    pathMatch: 'full'
  },
  {
    path: 'adicionar',
    loadComponent: () => import('./adicionar-jogador/adicionar-jogador.page').then(m => m.AdicionarJogadorPage)
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./editar-jogador/editar-jogador.page').then(m => m.EditarJogadorPage)
  },
  {
    path: 'editar-estatisticas/:id',
    loadComponent: () => import('./editar-estatisticas/editar-estatisticas.page').then(m => m.EditarEstatisticasPage)
  }
]; 