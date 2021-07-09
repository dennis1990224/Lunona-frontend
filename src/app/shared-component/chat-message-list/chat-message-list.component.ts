import { Component, OnInit, Input, ViewEncapsulation, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ChatMessage } from '@app/model/chat_message';
import { ContactMember } from '@app/model/contact_member';
import { ChatService } from '@app/service/chat.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@env/environment';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMessageModalComponent } from '@app/modal-component/delete-message-modal/delete-message-modal.component';
import { DeleteMessage } from '@app/model/delete_message';
import { DataShareService } from '@app/service/data-share.service';
import { PreviewImageModalComponent } from '@app/modal-component/preview-image-modal/preview-image-modal.component';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatMessageListComponent implements OnInit {

  @Input() public profileInfo: ContactMember;
  @Input() public myChatMessages: ChatMessage[];

  public token: string;
  public userName: string;
  public serverUrl: string = environment.serverUrl;
  public userAvatar: string;
  public uploadProgress: number;

  constructor(
    private cookieService: CookieService,
    private chatService: ChatService,
    private dialog: MatDialog,
    private ngZone: NgZone,
    private dataShareService: DataShareService
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.userAvatar = this.cookieService.get("Avatar");
    this.userName = this.cookieService.get("UserName");
  }

  ngOnInit(): void {
    console.log("here is the my chat message", this.myChatMessages);
    this.chatService.messageDelete.subscribe((res: DeleteMessage) => {
      this.ngZone.run(() => {
        if (res.Room === this.myChatMessages[0].Room) {
          this.deleteMessageFromList(res.MessageID);
        }
      });
    });
    this.chatService.conversationDelete.subscribe(res => {
      this.ngZone.run(() => {
        if (this.myChatMessages.length > 0) {
          if (res.Room === this.myChatMessages[0].Room) {
            this.myChatMessages = [];
          }
        }
      })
    });
    this.getUploadProgress();
  }

  /** delete message from list */
  public deleteMessageFromList(messageID: number): void {
    this.myChatMessages = this.myChatMessages.filter(item => {
      return item.MessageID !== messageID;
    });
  }

  /** ngOnchanges */
  public ngOnChanges(): void {
  }

  /** delete message from message list */
  public deleteMessage(message: ChatMessage): void {
    const dialogRef = this.dialog.open(DeleteMessageModalComponent, {
      data: message,
      panelClass: 'custom-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("delete message modal after close:", result);
    });
  }

  /** accept the receiving photo */
  public acceptPhoto(message: ChatMessage): void {
    this.chatService.acceptPhoto(this.token, message.MessageID, 'yes');
  }

  /** no accept the receiving photo */
  public noAcceptPhoto(message: ChatMessage): void {
    this.chatService.acceptPhoto(this.token, message.MessageID, 'no');
  }

  /** show translate message */
  public showTranslate(myChatMessage: ChatMessage): void {
    this.myChatMessages = this.myChatMessages.map(item => {
      if (item.MessageID === myChatMessage.MessageID) {
        if (myChatMessage.showTranslate) {
          item.translateText = "See translate";
          item.originalText = "See original";
        } else {
          item.translateText = "See Original";
          item.originalText = "See translate";
        }
        item.showTranslate = !item.showTranslate;
      }
      return item;
    })
  }

  /** get photo & video upload progrees */
  public getUploadProgress(): void {
    this.dataShareService.uploadProgress.subscribe((res) => {
      this.ngZone.run(() => {
        this.chatScrollDown();
        if (res.member) {
          if (res.member["Room"] === this.profileInfo.Room && res.progress > 0) {
            this.uploadProgress = res.progress;
            if (this.uploadProgress === 100) {
              setTimeout(() => {
                this.uploadProgress = 0;
              }, 500);
            }
          }
        }
      });
    });
  }

  /** chat scroll down */
  public chatScrollDown(): void {
    const chatBorad = document.body.querySelector("#messages");
    if (chatBorad) {
      chatBorad.scrollTop = chatBorad.scrollHeight;
    }
  }

  /** get photo url */
  public getUrl(myChatMessage: ChatMessage): string {
    if (!myChatMessage.ExtraData.includes("http")) {
      return `https://lunona.com${myChatMessage.ExtraData}`;
    } else {
      return myChatMessage.ExtraData;
    }
  }

  /** open photo with modal */
  public openPhoto(myChatMessage: ChatMessage): void {
    const photoUrl: string = this.getUrl(myChatMessage);
    const sendingData = {
      MediaType: "Photo",
      MediaURL: photoUrl
    }
    const dialogRef = this.dialog.open(PreviewImageModalComponent, {
      data: {
        images: [sendingData],
        category: "",
        index: 0
      },
      panelClass: 'preview-image-modalbox'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("preview image close result");
    });
  }
}
