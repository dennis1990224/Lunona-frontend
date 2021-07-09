import { Component, OnInit } from '@angular/core';
import { BankService } from '@app/service/bank.service';
import { CookieService } from 'ngx-cookie-service';
import { Transaction } from '@app/model/transaction';
import { MatDialog } from '@angular/material/dialog';
import { TransactionModalComponent } from '@app/modal-component/transaction-modal/transaction-modal.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-bank-balance',
  templateUrl: './bank-balance.component.html',
  styleUrls: ['./bank-balance.component.scss']
})
export class BankBalanceComponent implements OnInit {

  public token: string;
  public defaultsTransfer: any;
  public accountNumber: string;
  public balance: number;
  public myName: string;
  public dayFrom: number = 1;
  public dayTo: number = new Date().getUTCDate();
  public monthFrom: number = new Date().getUTCMonth() + 1;
  public monthTo: number = new Date().getUTCMonth() + 1;
  public yearFrom: number = new Date().getUTCFullYear();
  public yearTo: number = new Date().getUTCFullYear();
  public transactions: Transaction[];
  public dateRange: string = "Current month";
  public dateRangeArray: string[] = ["Last transactions (last 7 days)", "Current month", "Previous month", "This year", "Everything"];
  public startDate: Date;
  public endDate: Date = new Date();

  constructor(
    private bankService: BankService,
    private cookieService: CookieService,
    private dialog: MatDialog,
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.myName = this.cookieService.get("UserName");
    this.getBankTransferDefaults();
    this.getProfileTransactions();
    this.startDate = new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1);
  }

  ngOnInit(): void {
  }

  /** get bank transfer defaults */
  public getBankTransferDefaults(): void {
    this.bankService.getBankTransferDefaults(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.accountNumber = res.Data["myAccountNumber"];
          this.balance = res.Data["myBalanceAmount"];
          this.defaultsTransfer = res.Data["DefaultsTranfer"];
        }
      })
  }

  /** get profile transactions */
  public getProfileTransactions(): void {
    this.bankService.getProfileTransactions(this.dayFrom, this.dayTo, this.monthFrom, this.monthTo, this.yearFrom, this.yearTo, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.transactions = res.Data;
        }
      })
  }

  /** open transaction detail modal */
  public openTransactionDetail(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionModalComponent, {
      panelClass: 'custom-modalbox',
      data: transaction
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("transaction detail modal closed");
    })
  }

  /** change date range */
  public changeRange(): void {
    switch (this.dateRange) {
      case "Last transactions (last 7 days)":
        this.startDate = new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() - 7);
        this.endDate = new Date();
        this.getDateValues();
        break;
      case "Current month":
        this.startDate = new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1);
        this.endDate = new Date();
        this.getDateValues();
        break;
      case "Previous month":
        this.endDate = new Date(new Date(new Date().setDate(1)).setHours(-1));
        this.startDate = new Date(new Date(new Date(new Date().setDate(1)).setHours(-1)).setDate(1));
        this.getDateValues();
        break;
      case "This year":
        this.startDate = new Date(new Date().getUTCFullYear(), 0, 1);
        this.endDate = new Date();
        this.getDateValues();
        break;
      case "Everything":
        this.startDate = new Date(2000, 0, 1);
        this.endDate = new Date();
        this.getDateValues();
        break;
    }
  }

  /** get date Values */
  public getDateValues(): void {
    this.dayFrom = this.startDate.getUTCDate();
    this.dayTo = this.endDate.getUTCDate();
    this.monthFrom = this.startDate.getUTCMonth() + 1;
    this.monthTo = this.endDate.getUTCMonth() + 1;
    this.yearFrom = this.startDate.getUTCFullYear();
    this.yearTo = this.endDate.getUTCFullYear();
  }

  /** from day change evvent */
  public onFromChangeEvent(type: string, event: MatDatepickerInputEvent<Date>): void {
    this.startDate = event.value;
    this.getDateValues();
  }

  /** end day change event */
  public onToChangeEvent(type: string, event: MatDatepickerInputEvent<Date>): void {
    this.endDate = event.value;
    this.getDateValues();
  }

  /** load balance information on button event */
  public loadBalanceInfo(): void {
    this.getProfileTransactions();
  }
}
