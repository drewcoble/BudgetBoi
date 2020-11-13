import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomesPageRoutingModule } from './incomes-routing.module';

import { IncomesPage } from './incomes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomesPageRoutingModule
  ],
  declarations: [IncomesPage]
})
export class IncomesPageModule {}
