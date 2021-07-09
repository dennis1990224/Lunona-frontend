import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { ProfileDashboardData } from '@app/model/profile-dashboard-data';
import { ProfileTopContact } from '@app/model/profile-top-contact';
import { LanguageElement } from '@app/model/language_element';
import { ProfileDashboardService } from '@app/service/profile-dashboard.service';
import { CookieService } from 'ngx-cookie-service';
import { DataShareService } from '@app/service/data-share.service';
import { ConversationService } from '@app/service/conversation.service';
import { MemberItem } from '@app/model/member_item';
import { MatDialog } from '@angular/material/dialog';
import { MemberProfileModalComponent } from '@app/modal-component/member-profile-modal/member-profile-modal.component';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  public serverUrl: string = environment.serverUrl;
  public token: string;
  public dashboardData: ProfileDashboardData;
  public top15Contacts: ProfileTopContact[];
  public top15ContactsLoad: boolean[] = [];
  public languageMemberElements: LanguageElement[];
  public progressBar = document.querySelector('.progress-bar');
  public progress: number = 80;
  public intervalId: any;
  public isExist: boolean;
  public dashboardWinks = {
    circle1Dasharray: '628', circle1Dashoffset: '628',
    circle2Dasharray: '482', circle2Dashoffset: '482',
    circle3Dasharray: '360', circle3Dashoffset: '360'
  };
  public Total_TriesPercent: number = 0;
  public WinksPercent: number = 0;
  public stop: number;
  public stop1: number;

  constructor(
    private profileService: ProfileDashboardService,
    private cookieService: CookieService,
    private dataShareService: DataShareService,
    private conService: ConversationService,
    private dialog: MatDialog
  ) {
    this.languageMemberElements = this.dataShareService.getLanguageMemberElements();
    for (let i = 0; i < 15; i++) {
      this.top15ContactsLoad[i] = true;
    }
  }

  ngOnInit(): void {
    this.token = this.cookieService.get('LunonaToken');
    this.profileService.getDashboardData(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.dashboardData = res.Data;
          this.startChartAnimation(this.dashboardData);
          this.top15Contacts = this.dashboardData.Top15Contacts;
          if (this.top15Contacts.length > 0) {
            this.isExist = true;
          } else {
            this.isExist = false;
          }
        }
      });
    this.dataShareService.changeLanguageEvent
      .subscribe((res) => {
        if (res === true) {
          this.languageMemberElements = this.dataShareService.getLanguageMemberElements();
        }
      });
  }

  /** start chart animation */
  public startChartAnimation(dashboardData: ProfileDashboardData): void {
    this.stop = window.setTimeout(() => {
      const winksNotReplied = Math.abs(482 / dashboardData.WinksSent);
      const winksReplied = Math.abs(360 / dashboardData.WinksSent);
      this.dashboardWinks = {
        circle1Dasharray: '628',
        circle1Dashoffset: '0',
        circle2Dasharray: '482',
        circle2Dashoffset: Math.abs(winksNotReplied * dashboardData.WinksNotReplied).toString(),
        circle3Dasharray: '360',
        circle3Dashoffset: Math.abs(winksReplied * dashboardData.WinksReplied).toString()
      }
    }, 100);
    if (dashboardData.WinksPercent > 0) {
      this.stop1 = window.setInterval(() => {
        this.WinksPercent++;
        if (this.WinksPercent === dashboardData.WinksPercent || this.WinksPercent === 100) {
          window.clearInterval(this.stop1);
        }
      }, 40)
    }
  }

  /** get translate with keyword */
  public getTranslate(keyword: string): string {
    for (let item of this.languageMemberElements) {
      if (item.FullElementKey === keyword) {
        return item.Body;
      }
    }
  }

  /** open profile modal */
  public openProfile(profileTopContact: ProfileTopContact): void {
    this.conService.getPreviewProfileBasic(this.token, profileTopContact.LoginName)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          const profile: MemberItem = res.Data;
          const dialogRef = this.dialog.open(MemberProfileModalComponent, {
            data: profile,
            panelClass: 'member-profile-modal',
          });
          dialogRef.afterClosed().subscribe(result => {
          })
        }
      })
  }

}
