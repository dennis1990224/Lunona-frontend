import { Component, OnInit } from '@angular/core';
import { ConversationService } from '@app/service/conversation.service';
import { CookieService } from 'ngx-cookie-service';
import { ReadyMessageCategory } from '@app/model/ready_message_category';
import { ReadyMessage } from '@app/model/ready_message';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-auto-message-modal',
  templateUrl: './auto-message-modal.component.html',
  styleUrls: ['./auto-message-modal.component.scss']
})
export class AutoMessageModalComponent implements OnInit {

  public token: string;
  public readyMessageCategories: ReadyMessageCategory[];
  public readyMessages: ReadyMessage[];
  public readyMessageIndex: number = 1;

  constructor(
    private cookieService: CookieService,
    private convService: ConversationService,
    public dialogRef: MatDialogRef<AutoMessageModalComponent>,
  ) {
    this.token = this.cookieService.get("LunonaToken");
  }

  ngOnInit(): void {
    this.getReadyMessageCategories();
    this.getReadyMessageByCategory(110);
  }

  /** select category and get ready messages */
  public selectMessageCategory(categoryId: number): void {
    this.readyMessageIndex = categoryId;
    let messageCategory: number;
    switch (categoryId) {
      case 1:
        messageCategory = 110;
        break;
      case 2:
        messageCategory = 200;
        break;
      case 3:
        messageCategory = 160;
        break;
      case 4:
        messageCategory = 280;
        break;
      case 5:
        messageCategory = 130;
        break;
      case 6:
        messageCategory = 210;
        break;
      case 7:
        messageCategory = 140;
        break;
    }
    this.getReadyMessageByCategory(messageCategory);
  }

  /** get all ready message categories */
  public getReadyMessageCategories(): void {
    this.convService.getReadyMessageCategories(this.token)
      .subscribe(res => {
        if (res.ErrorMessage === "OK") {
          this.readyMessageCategories = res.Data;
        }
      })
  }

  /** get ready messages by category */
  public getReadyMessageByCategory(category: number): void {
    this.convService.getReadyMessagesByCategory(category, this.token)
      .subscribe((res) => {
        if (res.ErrorMessage === "OK") {
          this.readyMessages = res.Data;
          for (const item of this.readyMessages) {
            item.active = false;
          }
        }
      });
  }

  /** select ready message */
  public selectReadyMessage(readyMessage: ReadyMessage): void {
    this.dialogRef.close({success: "OK", data: readyMessage});
  }
}
