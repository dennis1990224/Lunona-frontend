import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankPowerComponent } from './bank-power.component';
import { Routes, RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxGaugeModule } from 'ngx-gauge';

const bankPowerRoute: Routes = [
  {
    path: '',
    component: BankPowerComponent
  }
]

@NgModule({
  declarations: [BankPowerComponent],
  imports: [
    CommonModule,
    NgxGaugeModule,
    RouterModule.forChild(bankPowerRoute),
    HighchartsChartModule
  ]
})
export class BankPowerModule { }
