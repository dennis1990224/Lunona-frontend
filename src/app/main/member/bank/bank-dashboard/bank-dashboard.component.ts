import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BankService } from '@app/service/bank.service';

@Component({
  selector: 'app-bank-dashboard',
  templateUrl: './bank-dashboard.component.html',
  styleUrls: ['./bank-dashboard.component.scss']
})
export class BankDashboardComponent implements OnInit {

  public canvasWidth = 170
  public needleValue = 30
  public centralLabel = ''
  public name = 'Gauge chart'
  public options = {
    hasNeedle: true,
    needleColor: '',
    needleUpdateSpeed: 1000,
    arcColors: ['#524a58'],
    arcDelimiters: [30],
    rangeLabel: ['0', '200'],
    needleStartValue: 30,
  }
  public token: string;
  public profileDashboardData: any;
  public percent: number;

  constructor(
    private cookieService: CookieService,
    private bankService: BankService
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.getBankProfileDashborad();
  }

  ngOnInit(): void {
  }

  /** get bank profile dashboard data */
  public getBankProfileDashborad(): void {
    this.bankService.getBankProfileDashboard(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profileDashboardData = res.Data;
          this.percent = this.profileDashboardData.TotalLUN/this.profileDashboardData.IncomingLUN*100;
          console.log(res.Data)
        }
      })
  }
}
