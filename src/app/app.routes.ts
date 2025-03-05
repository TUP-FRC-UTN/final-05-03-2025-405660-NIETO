import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'reserve', loadComponent: () => import('./reserve/reserve.component').then(m => m.ReserveComponent) },
  { path: 'list', loadComponent: () => import('./reservations-list/reservations-list.component').then(m => m.ReservationsListComponent) },
  { path: '', redirectTo: '/reserve', pathMatch: 'full' },
  { path: '**', redirectTo: '/reserve' }
];