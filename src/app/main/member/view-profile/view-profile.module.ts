import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProfileComponent } from './view-profile.component';
import { Routes, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';

const viewProfileRoute: Routes = [
  {
    path: '',
    component: ViewProfileComponent
  }
]

@NgModule({
  declarations: [ViewProfileComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    SharedComponentModule,
    RouterModule.forChild(viewProfileRoute),
  ]
})
export class ViewProfileModule { }
