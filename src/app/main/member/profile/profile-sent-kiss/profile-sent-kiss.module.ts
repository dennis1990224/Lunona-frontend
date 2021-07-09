import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSentKissComponent } from './profile-sent-kiss.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileSentKissRoute: Routes = [
  {
    path: '',
    component: ProfileSentKissComponent
  }
]

@NgModule({
  declarations: [ProfileSentKissComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileSentKissRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileSentKissModule { }
