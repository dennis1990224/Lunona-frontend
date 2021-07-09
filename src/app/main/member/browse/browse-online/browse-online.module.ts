import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseOnlineComponent } from './browse-online.component';
import { Routes, RouterModule } from '@angular/router';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { Ng5SliderModule } from 'ng5-slider';

const browseOnlineRoute: Routes = [
  {
    path: '',
    component: BrowseOnlineComponent
  }
]

@NgModule({
  declarations: [BrowseOnlineComponent],
  imports: [
    CommonModule,
    AngularResizedEventModule,
    SharedComponentModule,
    InfiniteScrollModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSliderModule,
    Ng5SliderModule,
    RouterModule.forChild(browseOnlineRoute),
  ]
})
export class BrowseOnlineModule { }
