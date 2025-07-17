import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'jogadores',
        loadComponent: () =>
          import('../jogadores/lista-jogadores/lista-jogadores.page').then((m) => m.ListaJogadoresPage),
      },
      {
        path: 'estatisticas',
        loadComponent: () =>
          import('../estatisticas/estatisticas-gerais/estatisticas-gerais.page').then((m) => m.EstatisticasGeraisPage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
