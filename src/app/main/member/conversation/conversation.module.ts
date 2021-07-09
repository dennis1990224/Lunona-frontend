import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './conversation.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const conversationRoute: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: ConversationComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./conversation-dashboard/conversation-dashboard.module').then(m => m.ConversationDashboardModule)
          }
        ]
      },
      {
        path: 'chat/:profileID',
        component: ConversationComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./conversation-chat/conversation-chat.module').then(m => m.ConversationChatModule)
          }
        ]
      }
    ]
  }
]

@NgModule({
  declarations: [ConversationComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    SharedComponentModule,
    RouterModule.forChild(conversationRoute),
    FormsModule
  ]
})
export class ConversationModule { }
