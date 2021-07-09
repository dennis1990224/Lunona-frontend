import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {

  public pagePath: string;
  public sideNumber: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.activatedRoute.url.subscribe(url => {
      if (url.length > 0) {
        this.pagePath = url[0].path;
        this.checkPageStatus();
      }
    })
  }

  ngOnInit(): void {
  }

  /** check page status */
  public checkPageStatus(): void {
    switch (this.pagePath) {
      case "dashboard":
        this.sideNumber = 1;
        break;
      case "load-luns":
        this.sideNumber = 2;
        break;
      case "balance":
        this.sideNumber = 3;
        break;
      case "power":
        this.sideNumber = 4;
        break;
      case "auto-msg":
        this.sideNumber = 5;
        break;
      case "price-list":
        this.sideNumber = 6;
        break;
    }
  }

  /** go to bank dashboard */
  public goBankDashboard(): void {
    this.sideNumber = 1;
    this.router.navigateByUrl('/member/bank/dashboard');
  }

  /** go to bank load luns/credits */
  public goBankLuns(): void {
    this.sideNumber = 2;
    this.router.navigateByUrl('/member/bank/load-luns/exchange');
  }

  /** go to bank balance */
  public goBankBalance(): void {
    this.sideNumber = 3;
    this.router.navigateByUrl('/member/bank/balance');
  }

  /** go to bank power */
  public goBankPower(): void {
    this.sideNumber = 4;
    this.router.navigateByUrl('/member/bank/power');
  }
  
  /** go to bank auto message */
  public goBankAutoMsg(): void {
    this.sideNumber = 5;
    this.router.navigateByUrl('/member/bank/auto-msg/dashboard');
  }

  /** go to bank price list */
  public goBankPriceList(): void {
    this.sideNumber = 6;
    this.router.navigateByUrl('/member/bank/price-list');
  }

}
