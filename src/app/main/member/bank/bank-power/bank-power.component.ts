import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BankService } from '@app/service/bank.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';
import * as Highcharts from 'highcharts';
declare var require: any;
const HighchartsMore = require("highcharts/highcharts-more.src");
HighchartsMore(Highcharts);
const HC_solid_gauge = require("highcharts/modules/solid-gauge.src");
HC_solid_gauge(Highcharts);

@Component({
  selector: 'app-bank-power',
  templateUrl: './bank-power.component.html',
  styleUrls: ['./bank-power.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BankPowerComponent implements OnInit {

  public token: string;
  public profilePower: any;
  public myName: string;
  public serverUrl: string = environment.serverUrl;
  public ratingLevel: number;
  public ratingMultiple: number;
  public highcharts = Highcharts;
  public voteOptions: any;
  public rewardOption: any;

  constructor(
    private cookieService: CookieService,
    private bankService: BankService
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.myName = this.cookieService.get("UserName");
    this.getProfilePower();
  }

  ngOnInit(): void {
   
  }

  /** get profile power */
  public getProfilePower(): void {
    this.bankService.getProfilePower(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.profilePower = res.Data;
          console.log(this.profilePower)
          this.ratingLevel = this.profilePower.RatingLevel;
          this.ratingMultiple = this.profilePower.RatingMultiplier;
          this.voteOptions = {
            chart: {
              type: 'solidgauge'
            },
            title: null,
            pane: {
              center: ['50%', '85%'],
              size: '140%',
              startAngle: -90,
              endAngle: 90,
              background: {
                backgroundColor: '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
              }
            },
            tooltip: {
              enabled: false
            },
            yAxis: {
              min: 0,
              max: 200,
              stops: [
                [1.0, '#24b0ba'] 
              ],
              lineWidth: 0,
              minorTickInterval: null,
              tickPixelInterval: 400,
              tickWidth: 0,
              labels: {
                y: 20
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              data: [this.ratingLevel],
            }, {
              name: 'Foo',
              type: 'gauge',
              data: [this.ratingLevel]
            }],
            plotOptions: {
              solidgauge: {
                dataLabels: {
                  y: 5,
                  borderWidth: 0,
                  useHTML: true
                },
              }
            }
          };
          this.rewardOption = {
            chart: {
              type: 'solidgauge'
            },
            title: null,
            pane: {
              center: ['50%', '85%'],
              size: '140%',
              startAngle: -90,
              endAngle: 90,
              background: {
                backgroundColor: '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
              }
            },
            tooltip: {
              enabled: false
            },
            yAxis: {
              min: 0,
              max: 200,
              stops: [
                [1.0, '#fbd234'] 
              ],
              lineWidth: 0,
              minorTickInterval: null,
              tickPixelInterval: 400,
              tickWidth: 0,
              labels: {
                y: 20
              }
            },
            credits: {
              enabled: false
            },
            series: [{
              data: [this.ratingMultiple],
            }, {
              name: 'Foo',
              type: 'gauge',
              data: [this.ratingMultiple]
            }],
            plotOptions: {
              solidgauge: {
                dataLabels: {
                  y: 5,
                  borderWidth: 0,
                  useHTML: true
                },
              }
            }
          };
        }
      })
  }

}
