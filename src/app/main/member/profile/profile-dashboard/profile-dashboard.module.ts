import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDashboardComponent } from './profile-dashboard.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { NgApexchartsModule } from 'ng-apexcharts'
import { SafeHtmlPipe } from '@app/pipe/safehtml.pipe';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';

const ProfileDashboardRoute: Routes = [
  {
    path: '',
    component: ProfileDashboardComponent
  }
]

@NgModule({
  declarations: [ProfileDashboardComponent],
  imports: [
    CommonModule,
    NgCircleProgressModule.forRoot({}),
    RouterModule.forChild(ProfileDashboardRoute),
    MatDialogModule,
    NgApexchartsModule,
    SharedComponentModule
  ],
  providers: [
    SafeHtmlPipe
  ]
})
export class ProfileDashboardModule { }
