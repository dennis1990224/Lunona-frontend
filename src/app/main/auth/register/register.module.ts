import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RegisterComponent } from './register.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

const registerRoute: Routes = [
  {
    path: '',
    component: RegisterComponent
  }
]

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    SharedComponentModule,
    RouterModule.forChild(registerRoute),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule
  ],
  providers: [
    MatDatepickerModule,
    DatePipe
  ]
})
export class RegisterModule { }
