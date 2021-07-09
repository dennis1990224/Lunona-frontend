import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

const ProfileRoute: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-dashboard/profile-dashboard.module').then(m => m.ProfileDashboardModule)
          }
        ]
      },
      {
        path: 'my-profile',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-my-profile/profile-my-profile.module').then(m => m.ProfileMyProfileModule)
          }
        ]
      },
      {
        path: 'my-likes',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-my-likes/profile-my-likes.module').then(m => m.ProfileMyLikesModule)
          }
        ]
      },
      {
        path: 'chats',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-chats/profile-chats.module').then(m => m.ProfileChatsModule)
          }
        ]
      },
      {
        path: 'waiting-chat',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-wating-chat/profile-wating-chat.module').then(m => m.ProfileWatingChatModule)
          }
        ]
      },
      {
        path: 'blocked',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-blocked/profile-blocked.module').then(m => m.ProfileBlockedModule)
          }
        ]
      },
      {
        path: 'your-pin',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-your-pin/profile-your-pin.module').then(m => m.ProfileYourPinModule)
          }
        ]
      },
      {
        path: 'sent-kiss',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-sent-kiss/profile-sent-kiss.module').then(m => m.ProfileSentKissModule)
          }
        ]
      },
      {
        path: 'them-view',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-them-view/profile-them-view.module').then(m => m.ProfileThemViewModule)
          }
        ]
      },
      {
        path: 'view-them',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-view-them/profile-view-them.module').then(m => m.ProfileViewThemModule)
          }
        ]
      },
      {
        path: 'by-kiss',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-by-kiss/profile-by-kiss.module').then(m => m.ProfileByKissModule)
          }
        ]
      },
      {
        path: 'by-pinned',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-by-pinned/profile-by-pinned.module').then(m => m.ProfileByPinnedModule)
          }
        ]
      },
      {
        path: 'help-center',
        component: ProfileComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./profile-help-center/profile-help-center.module').then(m => m.ProfileHelpCenterModule)
          }
        ]
      }
    ]
  }
]

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    MatListModule, 
    FormsModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    RouterModule.forChild(ProfileRoute),
    MatDialogModule,
  ]
})
export class ProfileModule { }
