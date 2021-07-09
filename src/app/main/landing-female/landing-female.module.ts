import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentModule } from '@app/shared-component/shared-component.module';
import { FemaleOneComponent } from './female-one/female-one.component';
import { FemaleTwoComponent } from './female-two/female-two.component';
import { FemaleThreeComponent } from './female-three/female-three.component';
import { FemaleFourComponent } from './female-four/female-four.component';
import { FemaleFiveComponent } from './female-five/female-five.component';
import { FemaleSixComponent } from './female-six/female-six.component';
import { FemaleSevenComponent } from './female-seven/female-seven.component';
import { FemaleEightComponent } from './female-eight/female-eight.component';
import { FemaleNineComponent } from './female-nine/female-nine.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    FemaleOneComponent, 
    FemaleTwoComponent, 
    FemaleThreeComponent, 
    FemaleFourComponent, 
    FemaleFiveComponent, 
    FemaleSixComponent, 
    FemaleSevenComponent, 
    FemaleEightComponent, 
    FemaleNineComponent, 
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
export class LandingFemaleModule { }
