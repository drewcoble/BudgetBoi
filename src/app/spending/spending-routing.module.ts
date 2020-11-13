import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpendingPage } from './spending.page';

const routes: Routes = [
  {
    path: '',
    component: SpendingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpendingPageRoutingModule {}
