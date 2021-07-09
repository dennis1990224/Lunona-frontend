import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankComponent } from './bank.component';
import { RouterModule, Routes } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

const BankRoute: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: BankComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./bank-dashboard/bank-dashboard.module').then(m => m.BankDashboardModule)
          }
        ]
      },
      {
        path: 'load-luns',
        component: BankComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./bank-luns/bank-luns.module').then(m => m.BankLunsModule)
          }
        ]
      },
      {
        path: 'balance',
        component: BankComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./bank-balance/bank-balance.module').then(m => m.BankBalanceModule)
          }
        ]
      },
      {
        path: 'power',
        component: BankComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./bank-power/bank-power.module').then(m => m.BankPowerModule)
          }
        ]
      },
      {
        path: 'auto-msg',
        component: BankComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./bank-auto-msg/bank-auto-msg.module').then(m => m.BankAutoMsgModule)
          }
        ]
      },
      {
        path: 'price-list',
        component: BankComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./bank-price-list/bank-price-list.module').then(m => m.BankPriceListModule)
          }
        ]
      }
    ]
  }
]


@NgModule({
  declarations: [BankComponent],
  imports: [
    CommonModule,
    MatListModule, 
    FormsModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    RouterModule.forChild(BankRoute),
  ]
})
export class BankModule { }
