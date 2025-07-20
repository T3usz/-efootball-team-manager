import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/intro',
    pathMatch: 'full',
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro.page').then(m => m.IntroPage),
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
  {
    path: 'privacy',
    loadComponent: () => import('./legal/privacy.page').then(m => m.PrivacyPage)
  },
  {
    path: 'terms',
    loadComponent: () => import('./legal/terms.page').then(m => m.TermsPage)
  },
  {
    path: 'editar-time',
    loadComponent: () => import('./team/editar-time/editar-time.page').then(m => m.EditarTimePage)
  },
  {
    path: 'notificacoes',
    loadComponent: () => import('./notificacoes/notificacoes.page').then(m => m.NotificacoesPage)
  },
  {
    path: 'agenda',
    loadComponent: () => import('./agenda/agenda.page').then(m => m.AgendaPage)
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.page').then(m => m.NotFoundPage)
  }
];
