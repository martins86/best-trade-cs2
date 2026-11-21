import { Routes } from '@angular/router';
import { OpportunityListPage } from './features/opportunities/pages/opportunity-list.page';
import { OpportunityDetailPage } from './features/opportunities/pages/opportunity-detail.page';

export const routes: Routes = [
  { path: '', redirectTo: 'opportunities', pathMatch: 'full' },
  { path: 'opportunities', component: OpportunityListPage },
  { path: 'opportunities/:skinId', component: OpportunityDetailPage },
  { path: '**', redirectTo: 'opportunities' },
];
