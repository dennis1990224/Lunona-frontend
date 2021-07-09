import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMyLikesComponent } from './profile-my-likes.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { SafeHtmlPipe } from '@app/pipe/safehtml.pipe';

const ProfileMyLikesRoute: Routes = [
  {
    path: '',
    component: ProfileMyLikesComponent
  }
]

@NgModule({
  declarations: [ProfileMyLikesComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ProfileMyLikesRoute),
    SharedComponentModule,
  ],
  providers: [
    SafeHtmlPipe
  ]
})
export class ProfileMyLikesModule { }
