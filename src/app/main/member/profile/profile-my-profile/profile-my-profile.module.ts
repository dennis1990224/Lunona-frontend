import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMyProfileComponent } from './profile-my-profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { MaleProfilePreviewModalComponent } from '@app/modal-component/male-profile-preview-modal/male-profile-preview-modal.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { SafeHtmlPipe } from '@app/pipe/safehtml.pipe';

const ProfileMyProfileRoute: Routes = [
  {
    path: '',
    component: ProfileMyProfileComponent
  }
]

@NgModule({
  declarations: [
    ProfileMyProfileComponent,
    MaleProfilePreviewModalComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    AngularSvgIconModule.forRoot(),
    RouterModule.forChild(ProfileMyProfileRoute),
    SharedComponentModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
  ],
  providers: [
    SafeHtmlPipe
  ]
})
export class ProfileMyProfileModule { }
