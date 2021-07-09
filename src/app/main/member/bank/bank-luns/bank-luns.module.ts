import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankLunsComponent } from './bank-luns.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { BankPayComponent } from './bank-pay/bank-pay.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

const bankLunsRoute: Routes = [
  {
    path: 'exchange',
    component: BankLunsComponent
  },
  {
    path: 'pay/:sID',
    component: BankPayComponent
  }
]

@NgModule({
  declarations: [BankLunsComponent, BankPayComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(bankLunsRoute),
    SharedComponentModule,
    MatRadioModule,
    FormsModule
  ]
})
export class BankLunsModule { }
