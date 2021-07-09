import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const maleRoute: Routes = [
  {
    path: 'browse',
    component: MemberComponent,
    loadChildren: () => import('./browse/browse.module').then(m => m.BrowseModule)
  },
  {
    path: 'bank',
    component: MemberComponent,
    loadChildren: () => import('./bank/bank.module').then(m => m.BankModule)
  },
  {
    path: 'profile',
    component: MemberComponent,
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'conversation',
    component: MemberComponent,
    loadChildren: () => import('./conversation/conversation.module').then(m => m.ConversationModule)
  },
  {
    path: 'view-profile/:profileName',
    loadChildren: () => import('./view-profile/view-profile.module').then(m => m.ViewProfileModule)
  }
]


@NgModule({
  declarations: [MemberComponent],
  imports: [
    CommonModule,
    CommonModule,
    RouterModule.forChild(maleRoute),
    SharedComponentModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
})
export class MemberModule { }
