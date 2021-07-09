import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationChatComponent } from './conversation-chat.component';
import { RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollEventModule } from 'ngx-scroll-event';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [ConversationChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: "",
        component: ConversationChatComponent,
      },
    ]),
    SharedComponentModule,
    FormsModule,
    MatListModule,
    MatDialogModule,
    ScrollEventModule,
    MatProgressSpinnerModule
  ]
})
export class ConversationChatModule { }
