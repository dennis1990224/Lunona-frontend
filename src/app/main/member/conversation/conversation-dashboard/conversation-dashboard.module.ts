import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationDashboardComponent } from './conversation-dashboard.component';
import { Routes, RouterModule } from '@angular/router';

const chatDashboardRoute: Routes = [
  {
    path: '',
    component: ConversationDashboardComponent
  }
]

@NgModule({
  declarations: [ConversationDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(chatDashboardRoute),
  ]
})
export class ConversationDashboardModule { }
