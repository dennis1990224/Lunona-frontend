import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseComponent } from './browse.component';
import { RouterModule, Routes } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

const BrowseRoute: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-dashboard/browse-dashboard.module').then(m => m.BrowseDashboardModule)
          }
        ]
      },
      {
        path: 'near',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-close-you/browse-close-you.module').then(m => m.BrowseCloseYouModule)
          }
        ]
      },
      {
        path: 'online',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-online/browse-online.module').then(m => m.BrowseOnlineModule)
          }
        ]
      },
      {
        path: 'newlocal',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-country-arrivals/browse-country-arrivals.module').then(m => m.BrowseCountryArrivalsModule)
          }
        ]
      },
      {
        path: 'new',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-world-arrivals/browse-world-arrivals.module').then(m => m.BrowseWorldArrivalsModule)
          }
        ]
      },
      {
        path: 'socialposition',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-social/browse-social.module').then(m => m.BrowseSocialModule)
          }
        ]
      },
      {
        path: 'hostcity',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-host-you/browse-host-you.module').then(m => m.BrowseHostYouModule)
          }
        ]
      },
      {
        path: 'hostyourcity',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-host-them/browse-host-them.module').then(m => m.BrowseHostThemModule)
          }
        ]
      },
      {
        path: 'travel',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-travel/browse-travel.module').then(m => m.BrowseTravelModule)
          }
        ]
      },
      {
        path: 'workforyou',
        component: BrowseComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./browse-company/browse-company.module').then(m => m.BrowseCompanyModule)
          }
        ]
      }
    ]
  }
]

@NgModule({
  declarations: [BrowseComponent],
  imports: [
    CommonModule,
    MatListModule, 
    FormsModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    RouterModule.forChild(BrowseRoute),
  ]
})
export class BrowseModule { }
