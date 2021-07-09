import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileChatsComponent } from './profile-chats.component';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileChatRoute: Routes = [
  {
    path: '',
    component: ProfileChatsComponent
  }
]

@NgModule({
  declarations: [ProfileChatsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileChatRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileChatsModule { }
