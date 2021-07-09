import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileBlockedComponent } from './profile-blocked.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileBlockRoute: Routes = [
  {
    path: '',
    component: ProfileBlockedComponent
  }
]

@NgModule({
  declarations: [ProfileBlockedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileBlockRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileBlockedModule { }
