import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'opportunities', pathMatch: 'full' },
  {
    path: 'opportunities',
    loadComponent: () =>
      import('./features/opportunities/pages/opportunity-list.page').then(
        module => module.OpportunityListPage,
      ),
  },
  {
    path: 'opportunities/:skinId',
    loadComponent: () =>
      import('./features/opportunities/pages/opportunity-detail.page').then(
        module => module.OpportunityDetailPage,
      ),
  },
  { path: '**', redirectTo: 'opportunities' },
];
