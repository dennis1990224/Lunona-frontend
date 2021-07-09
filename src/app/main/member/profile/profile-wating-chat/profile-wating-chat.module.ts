import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileWatingChatComponent } from './profile-wating-chat.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileWaitingChatRoute: Routes = [
  {
    path: '',
    component: ProfileWatingChatComponent
  }
]


@NgModule({
  declarations: [ProfileWatingChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileWaitingChatRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileWatingChatModule { }
