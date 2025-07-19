import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'tabs',
    loadChildren: () => import('../tabs/tabs.routes').then((m) => m.routes),
    canActivate: [AuthGuard],
  },
  {
    path: 'jogadores',
    loadChildren: () => import('./jogadores/jogadores.routes').then((m) => m.jogadoresRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'jogadores/editar/:id',
    loadComponent: () => import('./jogadores/editar-jogador/editar-jogador.page').then((m) => m.EditarJogadorPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'jogadores/estatisticas/:id',
    loadComponent: () => import('./jogadores/editar-estatisticas/editar-estatisticas.page').then((m) => m.EditarEstatisticasPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'configuracoes',
    loadComponent: () => import('./configuracoes/configuracoes.page').then((m) => m.ConfiguracoesPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'agenda/registrar-resultado',
    loadComponent: () => import('./agenda/registrar-resultado/registrar-resultado.page').then((m) => m.RegistrarResultadoPage),
    canActivate: [AuthGuard],
  },
];
