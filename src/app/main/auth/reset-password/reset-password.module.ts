import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

const resetPassRoute: Routes = [
  {
    path  : '',
    component: ResetPasswordComponent
  }
]

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    SharedComponentModule,
    RouterModule.forChild(resetPassRoute),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
  ]
})
export class ResetPasswordModule { }
