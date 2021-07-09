import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileYourPinComponent } from './profile-your-pin.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const ProfileYourPinRoute: Routes = [
  {
    path: '',
    component: ProfileYourPinComponent
  }
]

@NgModule({
  declarations: [ProfileYourPinComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileYourPinRoute),
    SharedComponentModule,
    FormsModule,
    InfiniteScrollModule
  ]
})
export class ProfileYourPinModule { }
