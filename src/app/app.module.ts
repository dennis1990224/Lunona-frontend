import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MaleOneComponent } from './main/landing-male/male-one/male-one.component';
import { MaleTwoComponent } from './main/landing-male/male-two/male-two.component';
import { MaleThreeComponent } from './main/landing-male/male-three/male-three.component';
import { MaleFourComponent } from './main/landing-male/male-four/male-four.component';
import { MaleFiveComponent } from './main/landing-male/male-five/male-five.component';
import { MaleSixComponent } from './main/landing-male/male-six/male-six.component';
import { MaleSevenComponent } from './main/landing-male/male-seven/male-seven.component';
import { MaleEightComponent } from './main/landing-male/male-eight/male-eight.component';
import { MaleNineComponent } from './main/landing-male/male-nine/male-nine.component';
import { FemaleOneComponent } from './main/landing-female/female-one/female-one.component';
import { FemaleTwoComponent } from './main/landing-female/female-two/female-two.component';
import { FemaleThreeComponent } from './main/landing-female/female-three/female-three.component';
import { FemaleFourComponent } from './main/landing-female/female-four/female-four.component';
import { FemaleFiveComponent } from './main/landing-female/female-five/female-five.component';
import { FemaleSixComponent } from './main/landing-female/female-six/female-six.component';
import { FemaleSevenComponent } from './main/landing-female/female-seven/female-seven.component';
import { FemaleEightComponent } from './main/landing-female/female-eight/female-eight.component';
import { FemaleNineComponent } from './main/landing-female/female-nine/female-nine.component';
import { LandingMaleModule } from './main/landing-male/landing-male.module';
import { LandingFemaleModule } from './main/landing-female/landing-female.module';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'landing-male',
    pathMatch: 'full'
  },
  {
    path: 'landing-male',
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full'
      },
      {
        path: '1',
        component: MaleOneComponent,
        data: { state: 'male' }
      },
      {
        path: '2',
        component: MaleTwoComponent,
        data: { state: 'male' }
      },
      {
        path: '3',
        component: MaleThreeComponent,
        data: { state: 'male' }
      },
      {
        path: '4',
        component: MaleFourComponent,
        data: { state: 'male' }
      },
      {
        path: '5',
        component: MaleFiveComponent,
        data: { state: 'male' }
      },
      {
        path: '6',
        component: MaleSixComponent,
        data: { state: 'male' }
      },
      {
        path: '7',
        component: MaleSevenComponent,
        data: { state: 'male' }
      },
      {
        path: '8',
        component: MaleEightComponent,
        data: { state: 'male' }
      },
      {
        path: '9',
        component: MaleNineComponent,
        data: { state: 'male' }
      }
    ]
  },
  {
    path: 'landing-female',
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full'
      },
      {
        path: '1',
        component: FemaleOneComponent,
        data: { state: 'female' }
      },
      {
        path: '2',
        component: FemaleTwoComponent,
        data: { state: 'female' }
      },
      {
        path: '3',
        component: FemaleThreeComponent,
        data: { state: 'female' }
      },
      {
        path: '4',
        component: FemaleFourComponent,
        data: { state: 'female' }
      },
      {
        path: '5',
        component: FemaleFiveComponent,
        data: { state: 'female' }
      },
      {
        path: '6',
        component: FemaleSixComponent,
        data: { state: 'female' }
      },
      {
        path: '7',
        component: FemaleSevenComponent,
        data: { state: 'female' }
      },
      {
        path: '8',
        component: FemaleEightComponent,
        data: { state: 'female' }
      },
      {
        path: '9',
        component: FemaleNineComponent,
        data: { state: 'female' }
      },
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('./main/auth/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./main/auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./main/auth/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'member',
    loadChildren: () => import('./main/member/member.module').then(m => m.MemberModule)
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    LandingMaleModule,
    LandingFemaleModule,
    HttpClientModule,
    HammerModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
