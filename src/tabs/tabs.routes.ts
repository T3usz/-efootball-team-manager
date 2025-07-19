import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../app/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'jogadores',
        loadComponent: () =>
          import('../app/jogadores/lista-jogadores/lista-jogadores.page').then((m) => m.ListaJogadoresPage),
      },
      {
        path: 'estatisticas',
        loadComponent: () =>
          import('../app/estatisticas/estatisticas-gerais/estatisticas-gerais.page').then((m) => m.EstatisticasGeraisPage),
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('../app/configuracoes/configuracoes.page').then((m) => m.ConfiguracoesPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
