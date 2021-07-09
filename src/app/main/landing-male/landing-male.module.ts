import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentModule } from 'src/app/shared-component/shared-component.module';
import { MaleEightComponent } from './male-eight/male-eight.component';
import { MaleNineComponent } from './male-nine/male-nine.component';
import { MaleOneComponent } from './male-one/male-one.component';
import { MaleTwoComponent } from './male-two/male-two.component';
import { MaleThreeComponent } from './male-three/male-three.component';
import { MaleFourComponent } from './male-four/male-four.component';
import { MaleFiveComponent } from './male-five/male-five.component';
import { MaleSixComponent } from './male-six/male-six.component';
import { MaleSevenComponent } from './male-seven/male-seven.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    MaleEightComponent,
    MaleNineComponent,
    MaleOneComponent,
    MaleTwoComponent,
    MaleThreeComponent,
    MaleFourComponent,
    MaleFiveComponent,
    MaleSixComponent,
    MaleSevenComponent,
  ],
  imports: [
    CommonModule,
    SharedComponentModule,
    FormsModule,
    MatRadioModule,
    GoogleMapsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class LandingMaleModule { }
