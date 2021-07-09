import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileByKissComponent } from './profile-by-kiss.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileByKissRoute: Routes = [
  {
    path: '',
    component: ProfileByKissComponent
  }
]

@NgModule({
  declarations: [ProfileByKissComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileByKissRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileByKissModule { }
