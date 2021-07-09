import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ChatService } from '@app/service/chat.service';
import { ConversationService } from '@app/service/conversation.service';
import { environment } from '@env/environment';
import { MemberItem } from '@app/model/member_item';

@Component({
  selector: 'app-confirm-wink-modal',
  templateUrl: './confirm-wink-modal.component.html',
  styleUrls: ['./confirm-wink-modal.component.scss']
})
export class ConfirmWinkModalComponent implements OnInit {

  public serverUrl: string = environment.serverUrl;
  public token: string;
  public userName: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmWinkModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MemberItem,
    private cookieService: CookieService,
    private chatService: ChatService,
    private conService: ConversationService,
  ) {
    this.token = this.cookieService.get("LunonaToken");
    this.userName = this.cookieService.get("UserName");
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  /** confirm send wink */
  public sendWink(): void {
    this.chatService.sendWink(this.token, this.data, this.userName);
  }
}
