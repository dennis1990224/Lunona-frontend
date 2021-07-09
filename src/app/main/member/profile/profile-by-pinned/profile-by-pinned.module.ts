import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileByPinnedComponent } from './profile-by-pinned.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileByPinnedRoute: Routes = [
  {
    path: '',
    component: ProfileByPinnedComponent
  }
]

@NgModule({
  declarations: [ProfileByPinnedComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileByPinnedRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileByPinnedModule { }
