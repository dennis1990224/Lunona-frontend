import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankPriceListComponent } from './bank-price-list.component';
import { Routes, RouterModule } from '@angular/router';

const bankPriceListRoute: Routes = [
  {
    path: '',
    component: BankPriceListComponent
  }
]

@NgModule({
  declarations: [BankPriceListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(bankPriceListRoute),
  ]
})
export class BankPriceListModule { }
