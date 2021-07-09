import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

const loginRoute: Routes = [
  {
    path: '',
    component: LoginComponent
  }
]

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedComponentModule,
    RouterModule.forChild(loginRoute),
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
  ]
})
export class LoginModule { }
