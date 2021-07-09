import { Component, OnInit } from '@angular/core';
import { BankService } from '@app/service/bank.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-luns',
  templateUrl: './bank-luns.component.html',
  styleUrls: ['./bank-luns.component.scss']
})
export class BankLunsComponent implements OnInit {

  public token: string;
  public packets: any[];

  constructor(
    private bankService: BankService,
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.token = this.cookieService.get("LunonaToken");
  }

  ngOnInit(): void {
    this.getPayPackets();
  }

  /** get pay packets */
  public getPayPackets(): void {
    this.bankService.getPayPackets(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.packets = res.Packets;
        }
      })
  }

}
