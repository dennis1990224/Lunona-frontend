import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileHelpCenterComponent } from './profile-help-center.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';

const ProfileHelpCenerRoute: Routes = [
  {
    path: '',
    component: ProfileHelpCenterComponent
  }
]

@NgModule({
  declarations: [ProfileHelpCenterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileHelpCenerRoute),
    SharedComponentModule
  ]
})
export class ProfileHelpCenterModule { }
