import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpendingPageRoutingModule } from './spending-routing.module';

import { SpendingPage } from './spending.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpendingPageRoutingModule
  ],
  declarations: [SpendingPage]
})
export class SpendingPageModule {}
