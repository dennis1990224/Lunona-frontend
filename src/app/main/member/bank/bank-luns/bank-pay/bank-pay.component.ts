import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BankService } from '@app/service/bank.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-bank-pay',
  templateUrl: './bank-pay.component.html',
  styleUrls: ['./bank-pay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BankPayComponent implements OnInit {

  public paymentMethodCode: string;
  public package: string;
  public selectedPacket: string;
  public selectedLuns: number;
  public selectedTotal: number;
  public token: string;
  public packets: any[];
  public payMethodItems: any[];
  public paymentDetail: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private bankService: BankService
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.activatedRoute.params.subscribe(params => {
      this.package = params["sID"];
      switch (this.package) {
        case "P15":
          this.selectedPacket = "Starter";
          this.selectedLuns = 400;
          this.selectedTotal = 15;
          break;
        case "P50":
          this.selectedPacket = "normal";
          this.selectedLuns = 2000;
          this.selectedTotal = 50;
          break;
        case "P150":
          this.selectedPacket = "Pro";
          this.selectedLuns = 7500;
          this.selectedTotal = 149;
          break;
        case "P220":
          this.selectedPacket = "Exclusive";
          this.selectedLuns = 14000;
          this.selectedTotal = 220;
          break;
      }
      this.getPayMethod();
      console.log(this.package);
    });
  }

  ngOnInit(): void {
  }

  /** get pay method */
  public getPayMethod(): void {
    this.bankService.getPayMethod(this.package, this.token)
      .subscribe((res) => {
        console.log(res);
        this.payMethodItems = res.Data["PayMethodItems"];
        this.paymentMethodCode = this.payMethodItems[0].Code;
      })
  }

  /** get payment detail and go to payment */
  public getAndPay(): void {
    console.log("here")
    const data = {
      PayMethodCode: this.paymentMethodCode,
      PackID: this.package,
      CustomAmound: this.selectedTotal,
      OnSuccessUrl: "/member/bank/balance",
      OnCanceledUrl: "/member/bank/dashboard",
      HideHeaderBar: true
    };
    const sendingData = {
      Token: this.token,
      Params: data
    }
    this.bankService.getPayMentDetail(sendingData)
      .subscribe((res) => {
        console.log(res);
        if (res.GetPayMethodDetails_v2Result.ErrorMessage === "OK") {
          this.paymentDetail = res.GetPayMethodDetails_v2Result.Data;
          window.open(this.paymentDetail.RedirectURL, "_self");
        }
      })
  }

}
