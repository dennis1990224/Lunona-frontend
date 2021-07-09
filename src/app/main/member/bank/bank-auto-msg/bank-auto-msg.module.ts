import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAutoMsgComponent } from './bank-auto-msg.component';
import { Routes, RouterModule } from '@angular/router';
import { AddFirstMessageComponent } from './add-first-message/add-first-message.component';
import { Ng5SliderModule } from 'ng5-slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

const bankAutoMsgRoute: Routes = [
  {
    path: 'dashboard',
    component: BankAutoMsgComponent
  },
  {
    path: 'make-new',
    component: AddFirstMessageComponent
  }
]

@NgModule({
  declarations: [BankAutoMsgComponent, AddFirstMessageComponent],
  imports: [
    CommonModule,
    Ng5SliderModule,
    RouterModule.forChild(bankAutoMsgRoute),
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class BankAutoMsgModule { }
