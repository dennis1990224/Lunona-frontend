import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankBalanceComponent } from './bank-balance.component';
import { Routes, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

const bankBalanceRoute: Routes = [
  {
    path: '',
    component: BankBalanceComponent
  }
]

@NgModule({
  declarations: [BankBalanceComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    RouterModule.forChild(bankBalanceRoute),
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule
  ]
})
export class BankBalanceModule { }
