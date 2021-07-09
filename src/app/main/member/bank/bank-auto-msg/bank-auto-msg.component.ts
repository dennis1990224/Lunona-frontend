import { Component, OnInit } from '@angular/core';
import { ListItem } from '@app/model/list_item';
import { CookieService } from 'ngx-cookie-service';
import { BankService } from '@app/service/bank.service';
import { AutoMessage } from '@app/model/auto_message';
import { DataShareService } from '@app/service/data-share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-auto-msg',
  templateUrl: './bank-auto-msg.component.html',
  styleUrls: ['./bank-auto-msg.component.scss']
})
export class BankAutoMsgComponent implements OnInit {

  public autoMessageRuleType: ListItem[];
  public myAutoMessages: AutoMessage[] = [];
  public token: string;
  public isAutoMessage: boolean = false;
  public executeMessagePreviewData: any;

  constructor(
    private cookieService: CookieService,
    private bankService: BankService,
    private dataShareService: DataShareService,
    private router: Router
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.getMyAutoMessages();
  }

  ngOnInit(): void {
  }

  /** get my auto messages */
  public getMyAutoMessages(): void {
    this.bankService.getMyAutoMessages(this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.myAutoMessages = [];
          if (res.Data.length > 0) {
            this.isAutoMessage = true;
          }
          for (const item of res.Data) {
            item.isDelete = false;
            item.isOpenExcute = false;
            if (item.ExecutionTypeComboID === 2) {
              item.isExcute = true;
            } else {
              item.isExcute = false;
            }
            this.myAutoMessages.push(item);
          }
          console.log(this.myAutoMessages)
        }
      })
  }

  /** open delete */
  public openDelete(index: number): void {
    this.myAutoMessages[index].isDelete = true;
  }

  /** cancel delete */
  public noDelete(index: number): void {
    this.myAutoMessages[index].isDelete = false;
  }

  /** delete auto message */
  public deleteAutoMessage(autoMessage: AutoMessage): void {
    let sendingData = {
      Command: "DELETE",
      Token: this.token,
      messageItem: {
        MessageID: autoMessage.MessageID
      }
    }
    this.bankService.setMyAutoMessage(sendingData)
      .subscribe((res) => {
        if (res.SetMyAutomaticMessageResult["ErrorMessage"] === "OK") {
          this.getMyAutoMessages();
        }
      })
  }

  /** open excute */
  public openExcute(index: number): void {
    this.bankService.getExecuteMessagePreview(this.token, this.myAutoMessages[index].MessageID)
      .subscribe((res) => {
        if (res["ExecuteMyAutomaticMessagePreviewResult"]) {
          this.executeMessagePreviewData = res["ExecuteMyAutomaticMessagePreviewResult"]["Data"];
          console.log(this.executeMessagePreviewData)
          this.myAutoMessages[index].isOpenExcute = true;
        }
      });
  }

  /** cancel execute */
  public cancelExecute(index: number): void {
    this.myAutoMessages[index].isOpenExcute = false;
  }

  /** edit my auto message */
  public editMyAutoMessage(myAutoMessage: AutoMessage): void {
    const shareResult: boolean = this.dataShareService.setAutoMessage(myAutoMessage);
    if (shareResult) {
      this.router.navigateByUrl("/member/bank/auto-msg/make-new");
    }
  }
}
