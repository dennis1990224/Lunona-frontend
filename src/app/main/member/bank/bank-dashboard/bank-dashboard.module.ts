import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDashboardComponent } from './bank-dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { GaugeChartModule } from 'angular-gauge-chart'
import { NgCircleProgressModule } from 'ng-circle-progress';

const bankDashboardRoute: Routes = [
  {
    path: '',
    component: BankDashboardComponent
  }
]

@NgModule({
  declarations: [BankDashboardComponent],
  imports: [
    CommonModule,
    GaugeChartModule,
    NgCircleProgressModule.forRoot({}),
    RouterModule.forChild(bankDashboardRoute),
  ]
})
export class BankDashboardModule { }
