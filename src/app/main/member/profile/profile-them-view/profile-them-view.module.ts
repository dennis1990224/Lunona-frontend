import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileThemViewComponent } from './profile-them-view.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileThemViewRoute: Routes = [
  {
    path: '',
    component: ProfileThemViewComponent
  }
]

@NgModule({
  declarations: [ProfileThemViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileThemViewRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileThemViewModule { }
