import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'incomes',
    loadChildren: () => import('./incomes/incomes.module').then( m => m.IncomesPageModule)
  },
  {
    path: 'bills',
    loadChildren: () => import('./bills/bills.module').then( m => m.BillsPageModule)
  },
  {
    path: 'spending',
    loadChildren: () => import('./spending/spending.module').then( m => m.SpendingPageModule)
  },
  {
    path: 'budget',
    loadChildren: () => import('./budget/budget.module').then( m => m.BudgetPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
