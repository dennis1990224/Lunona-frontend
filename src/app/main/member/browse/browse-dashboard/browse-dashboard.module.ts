import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseDashboardComponent } from './browse-dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';

const browseDashboardRoute: Routes = [
  {
    path: '',
    component: BrowseDashboardComponent
  }
]

@NgModule({
  declarations: [BrowseDashboardComponent],
  imports: [
    CommonModule,
    AngularResizedEventModule,
    SharedComponentModule,
    RouterModule.forChild(browseDashboardRoute),
  ]
})
export class BrowseDashboardModule { }
