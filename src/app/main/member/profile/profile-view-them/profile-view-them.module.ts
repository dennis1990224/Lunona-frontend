import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileViewThemComponent } from './profile-view-them.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileViewThemRoute: Routes = [
  {
    path: '',
    component: ProfileViewThemComponent
  }
]

@NgModule({
  declarations: [ProfileViewThemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileViewThemRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileViewThemModule { }
